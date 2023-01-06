import React, { useEffect, useState } from 'react';
import { AppEvents } from '@grafana/data';
import { Spinner } from '@grafana/ui';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { PanelType } from '../types';
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

const presentValueResolver = (panelType: string, currentValue: any, fieldConfig: any = {}) => {
  switch (panelType) {
    case PanelType.SWITCH:
      return /true$|1/gi.test(currentValue) ? 1 : 0;
    case PanelType.NUMERICFIELDWRITER:
      let currentValue_ = currentValue;
      if (currentValue > (fieldConfig?.max || 100)) {
        currentValue_ = fieldConfig?.max || 100;
      }
      if (currentValue < (fieldConfig?.min || 0)) {
        currentValue_ = fieldConfig?.min || 0;
      }
      return currentValue_;
    default:
      return currentValue;
  }
};

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
  const { setIsRunning, services, data, panelType, fieldConfig, isRunning } = props;
  const [originalValue, setOriginalValue] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false); // restrict to override value by props while editing
  const [currentResponse, setCurrentResponse] = useState({}); // datasource unable to return current value
  const useStyles = getStyles();
  const classes = useStyles();

  const writerValue = writerUiService.getFieldValue(writerUiService.dataFieldKeys.WRITER, data);
  const currentPriority = writerUiService.getFieldValue(writerUiService.dataFieldKeys.PRIORITY, data);

  const setCurrentValueInterceptor = (value: any) => {
    setIsEditing(true);
    setCurrentValue(value);
  };

  useEffect(() => {
    if (writerValue) {
      const { present_value } = writerValue;
      let value = presentValueResolver(panelType, present_value, fieldConfig);
      setCurrentValue(value);
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
      let value = presentValueResolver(panelType, present_value, fieldConfig);
      setOriginalValue(value);
      if (!isEditing) {
        setCurrentValue(value);
      }
    }
  }, [isEditing, currentResponse, writerValue]);

  const onSetValue = (value: any) => {
    setOriginalValue(value);
    onWriteValue(value);
  };

  const onWriteValue = (value: any) => {
    const selectedPriorityKey = currentPriority && currentPriority.name;
    const writerUUID = writerValue.uuid;

    if (!selectedPriorityKey) {
      appEvents.emit(AppEvents.alertError, ['Current priority not selected!']);
      return Promise.reject('Current priority not selected.');
    }
    const payload = writerUiService.constructWriterPayload(selectedPriorityKey, value);

    if (typeof services?.writerActionService?.createPointPriorityArray === 'function') {
      setIsRunning(true);
    } else {
      setIsRunning(false);
      setIsEditing(false);
    }
    return services?.writerActionService
      ?.createPointPriorityArray(writerUUID, payload)
      .then(res => {
        setCurrentResponse(res);
        appEvents.emit(AppEvents.alertSuccess, [`Point value set to ${value}`]);
      })
      .catch(() => {
        setCurrentResponse({});
        appEvents.emit(AppEvents.alertError, ['Unsuccessful to set writer value!']);
      })
      .finally(() => {
        setTimeout(()=> {
          setIsRunning(false);
          setIsEditing(false);
        }, 3000)

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
        setCurrentValue={setCurrentValueInterceptor}
      />
    </div>
  );
};
