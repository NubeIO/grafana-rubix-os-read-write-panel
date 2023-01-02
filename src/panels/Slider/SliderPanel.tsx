import React, { useEffect, useState } from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import { Slider } from '@material-ui/core';
// @ts-ignore
import { withWriter, WriterHocProps } from '../../hoc/withWriters';
import { PanelProps } from '../../types/panelProps';

interface SliderProps extends WriterHocProps, PanelProps {
  customStyles: any;
}

function getStyles(customStyles: any) {
  return makeStyles(() =>
    createStyles({
      slider: {
        width: '100%',
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

function SliderPanel(props: SliderProps) {
  // const { customStyles, fieldConfig, isRunning, services, data, setIsRunning, options } = props;
  const {
    currentValue,
    originalValue,
    setCurrentValue,
    onSetValue,
    customStyles,
    options,
    isRunning,
    onResetValue,
    fieldConfig,
  } = props;

  const useStyles = getStyles(customStyles);
  const classes = useStyles();

  let [_CustomSlider, setCustomSlider] = useState<any>(null);

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
        <Button disabled={isRunning} onClick={() => onSetValue(currentValue)} className={classes.button}>
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

export default withWriter(SliderPanel);
