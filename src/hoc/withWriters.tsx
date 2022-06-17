import React, { useState, useEffect } from 'react';
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
        top: '-32px',
        right: '0px',
        position: 'absolute',
      },
    })
  );
}

export const withWriter = (ComposedComponent: any) => (props: any) => {
  const { setIsRunning, services, data, panelType, fieldConfig, isRunning } = props;
  const [originalValue, setOriginalValue] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const useStyles = getStyles();
  const classes = useStyles();

  const writerValue = writerUiService.getFieldValue(writerUiService.dataFieldKeys.WRITER, data);
  const currentPriority = writerUiService.getFieldValue(writerUiService.dataFieldKeys.PRIORITY, data);

  useEffect(() => {
    if (writerValue) {
      const { present_value } = writerValue;
      let value = presentValueResolver(panelType, present_value, fieldConfig);
      setOriginalValue(value);
      setCurrentValue(value);
    }
  }, [writerValue]);

  const onSetValue = (value: any) => {
    setOriginalValue(value);
    onWriteValue(value);
  };

  const onWriteValue = (value: any) => {
    const selectedPriorityKey = currentPriority && currentPriority.name;
    const writerUUID = writerValue.uuid;

    if (!selectedPriorityKey) {
      return Promise.reject('Current priority not selected.');
    }
    const payload = writerUiService.constructWriterPayload(selectedPriorityKey, value);

    if (typeof services?.rfWriterActionService?.createPointPriorityArray === 'function') {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
    return services?.rfWriterActionService
      ?.createPointPriorityArray(writerUUID, payload)
      .then(() => {
        appEvents.emit(AppEvents.alertSuccess, [`Point value set to ${value}`]);
      })
      .catch(() => {
        appEvents.emit(AppEvents.alertError, ['zzzzzzzzzUnsucessful to set writer value.']);
      })
      .finally(() => {
        setIsRunning(false);
      });
  };

  const onResetValue = () => {
    setCurrentValue(originalValue);
  };

  return (
    <div className={classes.container}>
      {isRunning && <Spinner className={classes.spinnerContainer}></Spinner>}

      <ComposedComponent
        {...props}
        onSetValue={onSetValue}
        currentValue={currentValue}
        onResetValue={onResetValue}
        onWriteValue={onWriteValue}
        originalValue={originalValue}
        setCurrentValue={setCurrentValue}
      />
    </div>
  );
};
