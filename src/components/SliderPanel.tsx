import React, { useEffect, useState } from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import { Slider } from '@material-ui/core';
import * as writerUiService from '../services/writerUiService';
import { AppEvents } from '@grafana/data';
// @ts-ignore
import appEvents from 'grafana/app/core/app_events';

import { PanelProps } from '../types/panelProps';

interface SliderProps extends PanelProps {
  customStyles: any;
}

function getStyles(customStyles: any) {
  return makeStyles(() =>
    createStyles({
      slider: {
        flexDirection: 'column',
        padding: '10px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      button: { ...customStyles.button, width: '70px' },
    })
  );
}

const ThumbComponent = (props: any) => {
  const { currentValue } = props;

  return (
    <span {...props}>
      <span style={{ fontSize: 10 }}>{currentValue}</span>
    </span>
  );
};

export default function SliderPanel(props: SliderProps) {
  const { customStyles, fieldConfig, isRunning, services, data, setIsRunning, options } = props;
  const useStyles = getStyles(customStyles);
  const classes = useStyles();

  let [_CustomSlider, setCustomSlider] = useState<any>(null);
  const [originalValue, setOriginalValue] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);

  const writerValue = writerUiService.getFieldValue(writerUiService.dataFieldKeys.WRITER, data);
  const currentPriority = writerUiService.getFieldValue(writerUiService.dataFieldKeys.PRIORITY, data);

  const onSetValue = () => {
    setIsRunning(true);
    setOriginalValue(currentValue);
    onWriteValue(currentValue);
  };

  useEffect(() => {
    if (writerValue) {
      const { present_value } = writerValue;
      setOriginalValue(present_value);
      setCurrentValue(present_value);
      setIsRunning(false);
    }
  }, [writerValue]);

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

  useEffect(() => {
    setCustomSlider(
      withStyles({
        root: {
          height: 6,
          color: options?.overrideSliderSettings ? options?.sliderColor : customStyles?.slider?.color,
        },
        thumb: {
          marginTop: -8,
          marginLeft: -12,
          width: 24,
          height: 24,
          backgroundColor: '#fff',
          border: '2px solid currentColor',
          '&.MuiSlider-thumb.Mui-disabled': {
            marginTop: -8,
            marginLeft: -12,
            width: 24,
            height: 24,
            border: '50%',
          },
        },
        valueLabel: {
          left: 'calc(-50% + 4px)',
          top: '-32px',
        },
        track: {
          height: 6,
          borderRadius: 3,
        },
        rail: {
          height: 6,
          borderRadius: 3,
        },
      })(Slider)
    );
  }, [customStyles.slider.color, options]);

  return (
    <div className={classes.slider}>
      <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
        <Button onClick={onSetValue} className={classes.button}>
          Set
        </Button>
        <Button disabled={currentValue === originalValue} onClick={onResetValue} className={classes.button}>
          Reset
        </Button>
      </ButtonGroup>
      {_CustomSlider && (
        <_CustomSlider
          ThumbComponent={(props: any) => <ThumbComponent {...props} currentValue={currentValue} />}
          min={fieldConfig?.min || 0}
          max={fieldConfig?.max || 100}
          defaultValue={originalValue}
          value={currentValue}
          valueLabelDisplay="on"
          onChange={(e: any, value: any) => {
            let val = 0;
            if (typeof value !== 'number') {
              val = value[0];
            } else {
              val = value;
            }
            setCurrentValue(val);
          }}
          disabled={isRunning}
        />
      )}
    </div>
  );
}
