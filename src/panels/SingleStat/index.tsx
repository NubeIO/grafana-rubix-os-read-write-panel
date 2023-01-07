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
  const { options, dataValue, textSettings } = props;
  const { image, showValue, overrideValue, trueValue, falseValue, overrideTextSettings } = options || {};

  const [textSize, setTextSize] = useState(0);
  const [unitSize, setUnitSize] = useState(0);
  const [defaultUnitColor, setDefaultUnitColor] = useState('');
  const [state, setState] = useState(false);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (overrideTextSettings) {
      setTextSize(options?.textSize || 40);
      setUnitSize(options?.unitSize || 20);
      setDefaultUnitColor(options?.unitColor || '#000');
    } else {
      setTextSize(textSettings.textSize);
      setUnitSize(textSettings.unitSize);
      setDefaultUnitColor(textSettings.unitColor);
    }
  }, [overrideTextSettings, textSettings, options]);

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
        color: dataValue?.threshold?.color,
      },
      value: {
        fontSize: textSize,
        display: 'inline-block',
        textAlign: 'center',
      },
      unit: {
        fontSize: `${unitSize}px`,
        marginLeft: '6px',
        color: defaultUnitColor,
      },
      imageWrapper: {
        height: showValue ? `calc(100% - ${textSize}px)` : '100%',
      },
    })
  );

  useEffect(() => {
    setState(!/^(false|0)$/gi.test(dataValue?.text));
  }, [dataValue]);

  useEffect(() => {
    if (overrideValue) {
      setDisplayText(state ? trueValue || '' : falseValue || '');
    } else {
      setDisplayText(dataValue?.text);
    }
  }, [dataValue?.text, state, overrideValue, trueValue, falseValue]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      {(showValue || image === Image.NoImage) && (
        <div className={classes.textWrapper}>
          <div>
            <span className={classes.value}>{displayText}</span>
            {dataValue?.suffix && <span className={classes.unit}>{dataValue?.suffix?.trim()}</span>}
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
