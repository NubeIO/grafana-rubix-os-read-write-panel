import React from 'react';
import { PanelProps } from '../types/panelProps';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Input } from '@grafana/ui';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { IconButton } from '@material-ui/core';
import { MathUtils } from '../utils/math';
import { withWriter, WriterHocProps } from '../hoc/withWriters';

interface SliderProps extends WriterHocProps, PanelProps {
  customStyles: any;
}

function NumericFieldWriterPanel(props: SliderProps) {
  const {
    isRunning,
    originalValue,
    currentValue,
    onSetValue,
    setCurrentValue,
    customStyles,
    onResetValue,
    options: { step = 1 } = { step: 1 },
    fieldConfig,
  } = props;

  const useStyles = makeStyles(() =>
    createStyles({
      root: {
        flexDirection: 'column',
        padding: '10px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      blankLine: {
        marginTop: '6px',
      },
      line: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      button: { ...customStyles.button, width: '70px' },
      input: { width: '140px' },
      arrowButton: {
        marginLeft: '4px',
        height: '32px',
        width: '32px',
      },
    })
  );

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.line}>
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
          <Button disabled={isRunning} onClick={() => onSetValue(currentValue)} className={classes.button}>
            Set
          </Button>
          <Button disabled={currentValue === originalValue} onClick={onResetValue} className={classes.button}>
            Reset
          </Button>
        </ButtonGroup>
        <IconButton
          className={classes.arrowButton}
          onClick={() => {
            const maxValue = fieldConfig?.max || 100;
            if (currentValue + step <= maxValue) {
              setCurrentValue(MathUtils.convertToNonZerosDecimal(currentValue + step));
            } else {
              setCurrentValue(maxValue);
            }
          }}
          aria-label="add"
          color="primary"
        >
          <ArrowUpwardIcon fontSize="inherit" />
        </IconButton>
      </div>
      <div className={classes.blankLine} />
      <div className={classes.line}>
        <Input
          className={classes.input}
          type="number"
          min={fieldConfig?.min || 0}
          max={fieldConfig?.max || 100}
          defaultValue={originalValue}
          value={currentValue}
          onChange={(e: any) => {
            setCurrentValue(e.target.value);
          }}
          step={step}
          disabled={isRunning}
        />
        <IconButton
          className={classes.arrowButton}
          onClick={() => {
            const minValue = fieldConfig?.min || 0;
            if (currentValue - step >= minValue) {
              setCurrentValue(MathUtils.convertToNonZerosDecimal(currentValue - step));
            } else {
              setCurrentValue(minValue);
            }
          }}
          aria-label="subtract"
          color="primary"
        >
          <ArrowDownwardIcon fontSize="inherit" />
        </IconButton>
      </div>
    </div>
  );
}

export default withWriter(NumericFieldWriterPanel);
