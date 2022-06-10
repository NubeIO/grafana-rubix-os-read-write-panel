import React, { useState, useEffect } from 'react';
import * as writerUiService from '../services/writerUiService';
import { AppEvents } from '@grafana/data';
// @ts-ignore
import appEvents from 'grafana/app/core/app_events';
import { PanelProps } from '../types/panelProps';
import { PanelType } from '../types';

export interface WriterHocProps extends PanelProps {
  onSetValue: Function;
  currentValue: String;
  onResetValue: Function;
  onWriteValue: Function;
  originalValue: String;
}

const presentValueResolver = (panelType: string, currentValue: any) => {
  switch (panelType) {
    case PanelType.SWITCH:
      return /true$|1/gi.test(currentValue) ? 1 : 0;
    default:
      return currentValue;
  }
};

export const withWriter = (ComposedComponent: any) => (props: any) => {
  const { setIsRunning, services, data, panelType } = props;
  const [originalValue, setOriginalValue] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);

  const writerValue = writerUiService.getFieldValue(writerUiService.dataFieldKeys.WRITER, data);
  const currentPriority = writerUiService.getFieldValue(writerUiService.dataFieldKeys.PRIORITY, data);

  useEffect(() => {
    if (writerValue) {
      const { present_value } = writerValue;
      let value = presentValueResolver(panelType, present_value);
      setOriginalValue(value);
      setCurrentValue(value);
      setIsRunning(false);
    }
  }, [writerValue]);

  const onSetValue = (value: any) => {
    setIsRunning(true);
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

    return services?.rfWriterActionService
      ?.createPointPriorityArray(writerUUID, payload)
      .then(() => {
        appEvents.emit(AppEvents.alertSuccess, [`Point value set to ${value}`]);
      })
      .catch(() => {
        appEvents.emit(AppEvents.alertError, ['Unsucessful to set writer value.']);
      });
  };

  const onResetValue = () => {
    setCurrentValue(originalValue);
  };

  return (
    <ComposedComponent
      {...props}
      onSetValue={onSetValue}
      currentValue={currentValue}
      onResetValue={onResetValue}
      onWriteValue={onWriteValue}
      originalValue={originalValue}
    />
  );
};
