import React from 'react';
import { css } from 'emotion';
import { stylesFactory } from '@grafana/ui';
import { createStyles, Theme, withStyles } from '@material-ui/core';
import Switch, { SwitchClassKey, SwitchProps } from '@material-ui/core/Switch';

import { SwitchColorSettings } from '../../types';
import { PanelProps } from '../../types/panelProps';
import { withWriter, WriterHocProps } from '../../hoc/withWriters';

interface SwitchPanelProps extends WriterHocProps, PanelProps {
  switchColorSettings: SwitchColorSettings;
}

function SwitchPanel(props: SwitchPanelProps) {
  const { originalValue, onSetValue, options, isRunning, switchColorSettings } = props;

  const handleClick = () => {
    const value = !originalValue ? 1 : 0;
    onSetValue(value);
  };

  const styles = getStyles();

  const IOSSwitch = withStyles((theme: Theme) =>
    createStyles({
      root: {
        width: 100,
        height: 52,
        padding: 0,
        margin: theme.spacing(1),
      },
      switchBase: {
        '&.MuiSwitch-colorSecondary.Mui-disabled + .MuiSwitch-track': {
          backgroundColor: '#15171A !important',
        },
        padding: 2,
        '&$checked': {
          transform: 'translateX(48px)',
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
        width: 48,
        height: 48,
      },
      track: {
        borderRadius: 50 / 2,
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

  return (
    <div className={styles.switchWrapper}>
      <IOSSwitch checked={+originalValue !== 0} disabled={isRunning} onClick={handleClick} />
    </div>
  );
}

const getStyles = stylesFactory(() => {
  return {
    switchWrapper: css`
      display: flex;
      height: 100%;
      align-items: center;
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

export default withWriter(SwitchPanel);
