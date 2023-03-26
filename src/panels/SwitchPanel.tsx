import React, { useState } from 'react';
import { css } from 'emotion';
import { stylesFactory } from '@grafana/ui';
import { createStyles, Theme, withStyles } from '@material-ui/core';
import Switch, { SwitchClassKey, SwitchProps } from '@material-ui/core/Switch';

import { SwitchColorSettings } from '../types';
import { PanelProps } from '../types/panelProps';
import { withWriter, WriterHocProps } from '../hoc/withWriters';

interface SwitchPanelProps extends WriterHocProps, PanelProps {
  switchColorSettings: SwitchColorSettings;
}

export function SwitchPanelComponent(props: SwitchPanelProps) {
  const { isEditPanel, originalValue: _originalValue, onSetValue, options, isRunning, switchColorSettings } = props;
  let [internalVal, setInternalVal] = useState(_originalValue);

  const handleClick = () => {
    const value = !(isEditPanel ? internalVal : _originalValue) ? 1 : 0;
    onSetValue(value);
    setInternalVal(value);
  };

  const styles = getStyles();

  const width = options?.width ?? 100;
  const height = options?.height ?? 52;

  const IOSSwitch = withStyles((theme: Theme) =>
    createStyles({
      root: {
        width: width,
        height: height,
        padding: 0,
        margin: theme.spacing(1),
      },
      switchBase: {
        '&.MuiSwitch-colorSecondary.Mui-disabled + .MuiSwitch-track': {
          backgroundColor: '#15171A !important',
        },
        padding: 2,
        '&$checked': {
          transform: `translateX(${width - height}px)`,
          color: theme.palette.common.white,
          '& + $track': {
            backgroundColor: options?.overrideSwitchColorSettings
              ? options?.switchTrueColor
              : switchColorSettings?.switchTrueColor,
            opacity: 1,
            border: `1px solid ${theme.palette.grey[400]}`,
          },
        },
        '&$focusVisible $thumb': {
          color: '#52d869',
          border: '6px solid #fff',
        },
      },
      thumb: {
        width: height - 4,
        height: height - 4,
      },
      track: {
        borderRadius: height / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: options?.overrideSwitchColorSettings
          ? options?.switchFalseColor
          : switchColorSettings?.switchFalseColor,
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
      },
      checked: {},
      focusVisible: {},
    })
  )(({ classes, ...props }: Props) => {
    return (
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
        {...props}
      />
    );
  });

  const isTruthyVal = (val: any) => {
    const value = +val;
    if (isNaN(value)) {
      return !!val;
    }
    return value !== 0;
  };
  const originalValue = isEditPanel ? internalVal : _originalValue;
  return (
    <div className={styles.switchWrapper} onClick={handleClick}>
      <IOSSwitch checked={isTruthyVal(originalValue)} disabled={isRunning} />
    </div>
  );
}

const getStyles = stylesFactory(() => {
  return {
    switchWrapper: css`
      display: flex;
      height: 100%;
      align-items: center;
      cursor: pointer;
      justify-content: center;
    `,
  };
});

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}

interface Props extends SwitchProps {
  classes: Styles;
}

export default withWriter(SwitchPanelComponent);
