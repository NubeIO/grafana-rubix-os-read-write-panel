import React, { useEffect, useState } from 'react';
import { Image, TextSettings } from 'types';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { PanelProps } from 'types/panelProps';
import { withWriter } from 'hoc/withWriters';
import { Icons } from 'assets/icons';

const images: any = {
  AlertOff: Icons.ALERT_OFF,
  AlertOn: Icons.ALERT_ON,
  CoolingOff: Icons.COOL_OFF,
  CoolingOn: Icons.COOL_ON,
  FanOff: Icons.FAN_OFF,
  FanOn: Icons.FAN_ON,
  HeatingOff: Icons.HEAT_OFF,
  HeatingOn: Icons.HEAT_ON,
  LightOff: Icons.LIGHT_OFF,
  LightOn: Icons.LIGHT_ON,
};

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
    setState(!/^(false|0|)$/gi.test(dataValue?.text)); // false, 0, ''
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
            <span className={classes.value} key={displayText}>
              {displayText}
            </span>
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

function StatusImage({ image, state }: { image: string; state: boolean }) {
  const [displayImage, setDisplayImage] = useState('');
  useEffect(() => {
    if (image !== Image.NoImage) {
      if (state) {
        setDisplayImage(`${image}On`);
      } else {
        setDisplayImage(`${image}Off`);
      }
    }
  }, [image, state]);

  return (
    <>
      {image !== Image.NoImage && (
        <img
          src={images[displayImage]?.uri}
          alt={displayImage}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        />
      )}
    </>
  );
}

export default withWriter(SingleStatPanel);
