import React, { useEffect, useState } from 'react';
import { AppEvents, getDisplayProcessor } from '@grafana/data';
import { Spinner } from '@grafana/ui';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as _ from 'lodash';

import { PanelProps } from '../types/panelProps';
// @ts-ignore
import appEvents from 'grafana/app/core/app_events';
import * as writerUiService from '../services/writerUiService';

export interface WriterHocProps extends PanelProps {
  onSetValue: any;
  setCurrentValue: any;
  currentValue: any;
  onResetValue: any;
  onWriteValue: any;
  originalValue: any;
}

function getStyles() {
  return makeStyles(() =>
    createStyles({
      container: {
        position: 'relative',
        flexDirection: 'column',
        padding: '10px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      spinnerContainer: {
        top: '-16px',
        right: '0',
        position: 'absolute',
      },
    })
  );
}

export const withWriter = (ComposedComponent: any) => (props: any) => {
  const { setIsRunning, onGetValue, services, data, isRunning } = props;
  const [originalValue, setOriginalValue] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [value, setValue] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false); // restrict to override value by props while editing
  const [currentResponse, setCurrentResponse] = useState({} as any); // datasource unable to return current value
  const useStyles = getStyles();
  const classes = useStyles();

  const writerValue = writerUiService.getFieldValue(writerUiService.dataFieldKeys.WRITER, data) as any;
  const currentPriority = writerUiService.getFieldValue(writerUiService.dataFieldKeys.PRIORITY, data) as any;

  const setCurrentValueInterceptor = (value: any) => {
    setIsEditing(true);
    setCurrentValue(value);
  };

  useEffect(() => {
    const value = props?.data?.series[0]?.fields[1]?.display?.(writerValue?.present_value);
    // To calculate non-mapped converted standard output (it includes decimal, unit conversion but not mapping)
    const displayProcessorWithoutMapping = getDisplayProcessor({
      field: {
        ...props?.data?.series[0]?.fields[1],
        config: {
          ...props?.data?.series[0]?.fields[1]?.config,
          mappings: [],
        },
      },
    });
    const valueWithoutMapping = displayProcessorWithoutMapping(writerValue?.present_value);
    setValue({ ...value, suffix: valueWithoutMapping.suffix });
  }, [data, currentResponse]);

  useEffect(() => {
    if (writerValue) {
      setCurrentValue(writerValue?.present_value);
    }
  }, []);

  useEffect(() => {
    if (writerValue) {
      setCurrentResponse({});
    }
  }, [writerValue]);

  useEffect(() => {
    if (writerValue) {
      let { present_value } = writerValue;
      if (!_.isEmpty(currentResponse)) {
        present_value = currentResponse.present_value;
      }
      setOriginalValue(present_value);
      if (!isEditing) {
        setCurrentValue(present_value);
      }
    }
  }, [isEditing, currentResponse, writerValue]);

  const onSetValue = (value: any) => {
    setOriginalValue(value);
    onWriteValue(value);
  };

  const onWriteValue = async (value: any) => {
    const selectedPriorityKey = currentPriority && currentPriority.name;
    const writerUUID = writerValue.uuid;
    const hostUUID = writerValue.host_uuid;

    if (!selectedPriorityKey) {
      appEvents.emit(AppEvents.alertError, ['Current priority not selected!']);
      return Promise.reject('Current priority not selected.');
    }
    const payload = writerUiService.constructWriterPayloadValue(selectedPriorityKey, value);

    if (typeof services?.pointsService?.createPointPriorityArray === 'function') {
      setIsRunning(true);
    } else {
      setIsRunning(false);
      setIsEditing(false);
    }

    return await services?.pointsService
      ?.createPointPriorityArray(writerUUID, hostUUID, payload)
      .then(async (res: any) => {
        setCurrentResponse(res);
        await onGetValue();
        appEvents.emit(AppEvents.alertSuccess, [`Point value set to ${value}`]);
      })
      .catch(() => {
        setCurrentResponse({});
        appEvents.emit(AppEvents.alertError, ['Unsuccessful to set writer value!']);
      })
      .finally(() => {
        setIsRunning(false);
        setIsEditing(false);
      });
  };

  const onResetValue = () => {
    setCurrentValue(originalValue);
    setIsEditing(false);
  };

  return (
    <div className={classes.container}>
      {isRunning && (
        <div className={classes.spinnerContainer}>
          <Spinner size={12} className={classes.spinnerContainer}></Spinner>
        </div>
      )}

      <ComposedComponent
        {...props}
        onSetValue={onSetValue}
        currentValue={currentValue}
        onResetValue={onResetValue}
        onWriteValue={onWriteValue}
        originalValue={originalValue}
        dataValue={value}
        setCurrentValue={setCurrentValueInterceptor}
      />
    </div>
  );
};
