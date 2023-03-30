import React, { useEffect, useRef, useState } from 'react';
import { PanelProps } from '../types/panelProps';
import { MultiSwitchTabType, MultiSwitchType } from '../types';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import { withWriter, WriterHocProps } from '../hoc/withWriters';

interface MultiSwitchProps extends WriterHocProps, PanelProps {
  customStyles: any;
  multiSwitchTab: MultiSwitchTabType;
}

export function MultiSwitchPanelComponent(props: MultiSwitchProps) {
  const { isRunning, dataValue, currentValue: _currentValue, onSetValue, customStyles, multiSwitchTab } = props;

  const currentValue = dataValue ? dataValue.numeric : _currentValue;

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > *': {
          margin: theme.spacing(1),
        },
        height: '100%',
        justifyContent: 'center',
      },
      button: {
        ...customStyles.button,
        '&:disabled': {
          ...customStyles.button['&:disabled'],
          fontSize: multiSwitchTab?.type === MultiSwitchType.BUTTON ? '12px' : '16px',
        },
        textTransform: 'inherit',
      },
      popper: {
        zIndex: 10,
      },
    })
  );

  const classes = useStyles();
  const [originalName, setOriginalName] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [originalValue, setOriginalValue] = useState(currentValue);

  useEffect(() => {
    setOriginalValue(currentValue);
  }, [currentValue]);

  useEffect(() => {
    if (multiSwitchTab && multiSwitchTab.data) {
      Object.keys(multiSwitchTab.data).forEach((key) => {
        if (+multiSwitchTab.data[+key].value === currentValue) {
          setOriginalName(currentValue);
          setSelectedIndex(+key);
        }
      });
    }
  }, [currentValue]);

  useEffect(() => {
    if (multiSwitchTab && multiSwitchTab.data) {
      setDropdownOptions(Object.keys(multiSwitchTab.data).map((key) => multiSwitchTab.data[+key].name));
    }
  }, [multiSwitchTab]);

  const handleClick = (value: any) => {
    onSetValue(value);
    setOriginalValue(value);
  };

  const displayMultiSwitch = () => {
    return (
      multiSwitchTab &&
      Object.keys(multiSwitchTab.data).map((key) => {
        const sw = multiSwitchTab.data[+key];
        return (
          <Button
            key={key}
            className={classes.button}
            onClick={() => {
              if (isRunning) {
                return;
              }
              handleClick(sw.value);
            }}
            disabled={'' + originalValue === '' + sw.value}
          >
            {sw.name}
          </Button>
        );
      })
    );
  };

  const handleClickDropdown = () => {
    if (multiSwitchTab && multiSwitchTab.data) {
      handleClick(multiSwitchTab.data[selectedIndex].value);
    }
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement> | React.MouseEvent<HTMLAnchorElement>,
    index: number
  ) => {
    if (multiSwitchTab && multiSwitchTab.data) {
      setSelectedIndex(index);
      handleClick(multiSwitchTab.data[index].value);
      setOpen(false);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (!(anchorRef.current && anchorRef.current.contains(event.target as HTMLElement))) {
      setOpen(false);
    }
  };

  const displayDropDown = () => {
    return (
      <Grid container direction="column" alignItems="center">
        <Grid item xs={12}>
          <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
            <Button className={classes.button} onClick={handleClickDropdown} disabled>
              {originalName}
            </Button>
            <Button
              className={classes.button}
              size="small"
              aria-controls={open ? 'split-button-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper className={classes.popper} open={open} anchorEl={anchorRef.current} role={undefined} transition>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu">
                      {dropdownOptions.map((option, i) => {
                        return (
                          <MenuItem
                            key={option}
                            selected={option === originalName}
                            onClick={(event) => handleMenuItemClick(event, i)}
                          >
                            {option}
                          </MenuItem>
                        );
                      })}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Grid>
      </Grid>
    );
  };
  return (
    <div className={classes.root}>
      <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
        {multiSwitchTab && multiSwitchTab.type === MultiSwitchType.BUTTON && displayMultiSwitch()}
        {multiSwitchTab && multiSwitchTab.type === MultiSwitchType.DROPDOWN && displayDropDown()}
      </ButtonGroup>
    </div>
  );
}

export default withWriter(MultiSwitchPanelComponent);
