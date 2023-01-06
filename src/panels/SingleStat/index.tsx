import * as React from 'react';
import { useEffect, useState } from 'react';
import { Image, TextSettings } from 'types';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import StatusImage from './StatusImage';
import { PanelProps } from 'types/panelProps';
import { withWriter } from 'hoc/withWriters';

interface SingleStatProps extends PanelProps {
  textSettings: TextSettings;
}

function SingleStatPanel(props: SingleStatProps) {
  const { originalValue, options, textSettings } = props;
  const { image, showValue, overrideValue, trueValue, falseValue, overrideTextSettings, unit } = options || {};

  const [_unit, setUnit] = useState('');
  const [textSize, setTextSize] = useState(0);
  const [unitSize, setUnitSize] = useState(0);
  const [valueColor, setValueColor] = useState('');
  const [unitColor, setUnitColor] = useState('');
  const [state, setState] = useState(false);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (overrideTextSettings) {
      setTextSize(options?.textSize || 40);
      setValueColor(options?.textColor || '#000');
      setUnitSize(options?.unitSize || 20);
      setUnitColor(options?.unitColor || '#000');
    } else {
      setTextSize(textSettings.textSize);
      setValueColor(textSettings.textColor || '#000');
      setUnitSize(textSettings.unitSize);
      setUnitColor(textSettings.unitColor);
    }
    setUnit(options?.unit || '');
  }, [unit, overrideTextSettings, textSettings, options]);

  const useStyles = makeStyles(() =>
    createStyles({
      root: {
        display: 'flex',
        flexFlow: 'column',
        height: '100%',
        width: '100%',
        alignItems: 'center',
      },
      textWrapper: {
        display: 'flex',
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
        height: image !== Image.NoImage ? `${textSize}px` : '100%',
      },
      value: {
        fontSize: textSize,
        display: 'inline-block',
        textAlign: 'center',
        color: valueColor,
      },
      unit: {
        fontSize: `${unitSize}px`,
        marginLeft: '6px',
        color: unitColor,
      },
      imageWrapper: {
        height: showValue ? `calc(100% - ${textSize}px)` : '100%',
      },
    })
  );

  useEffect(() => {
    setState(/true$|1/gi.test(originalValue));
  }, [originalValue]);

  useEffect(() => {
    if (overrideValue) {
      setDisplayText(state ? trueValue || '' : falseValue || '');
    } else {
      setDisplayText(originalValue);
    }
  }, [originalValue, state, overrideValue, trueValue, falseValue]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      {(showValue || image === Image.NoImage) && (
        <div className={classes.textWrapper}>
          <div>
            <span className={classes.value}>{displayText}</span>
            <span className={classes.unit}>{_unit}</span>
          </div>
        </div>
      )}
      {image !== Image.NoImage && (
        <div className={classes.imageWrapper}>
          <StatusImage image={image || Image.NoImage} state={state} />
        </div>
      )}
    </div>
  );
}

export default withWriter(SingleStatPanel);
