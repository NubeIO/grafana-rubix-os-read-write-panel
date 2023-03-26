import React, { useEffect, useState } from 'react';
import {
  ButtonGroup,
  Button,
  HorizontalGroup,
  InlineField,
  InlineLabel,
  Input,
  LoadingPlaceholder,
  stylesFactory,
  useTheme,
  IconButton,
} from '@grafana/ui';
import { PanelType, Priority } from 'types';
import { Card, Button as TextButton, createTheme, Grid, ThemeProvider } from '@material-ui/core';
import { SliderPanelComponent } from 'panels/SliderPanel';
import { css } from 'emotion';
import { SwitchPanelComponent } from 'panels/SwitchPanel';
import { MultiSwitchPanelComponent } from 'panels/MultiSwitchPanel';
import { generateUUID } from 'utils/uuid';

function generateKeys(count: number): any {
  // @ts-ignore
  return [...Array(count).keys()].reduce((prev, curr) => {
    return {
      ...prev,
      [`_${curr + 1}`]: generateUUID(),
    };
  }, {});
}

const getKeyLabel = (key: string) => {
  const value = {
    _1: '1',
    _2: '2',
    _3: '3',
    _4: '4',
    _5: '5',
    _6: '6',
    _7: '7',
    _8: '8',
    _9: '9',
    _10: '10',
    _11: '11',
    _12: '12',
    _13: '13',
    _14: '14',
    _15: '15',
    _16: '16',
  };
  // @ts-ignore
  return value[key];
};

export const WritePointValueModal = (props: any) => {
  const { open, closeGenericDialog, panelType, options, priority, setPriority } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState({} as any);
  const [keys, setKeys] = useState(generateKeys(16));

  const theme = useTheme();

  const initialFormValues = () => {
    const value = {
      _1: getNum(priority['_1']),
      _2: getNum(priority['_2']),
      _3: getNum(priority['_3']),
      _4: getNum(priority['_4']),
      _5: getNum(priority['_5']),
      _6: getNum(priority['_6']),
      _7: getNum(priority['_7']),
      _8: getNum(priority['_8']),
      _9: getNum(priority['_9']),
      _10: getNum(priority['_10']),
      _11: getNum(priority['_11']),
      _12: getNum(priority['_12']),
      _13: getNum(priority['_13']),
      _14: getNum(priority['_14']),
      _15: getNum(priority['_15']),
      _16: getNum(priority['_16']),
    };
    setFormData(value);
  };

  const getNum = (value: any) => {
    if (typeof value === 'number' && String(value)) {
      //include case value = 0
      return value;
    } else {
      //include case typeof value = string
      return null;
    }
  };

  const renderPanelType = (panels: PanelType[]) => {
    return panels.indexOf(panelType) >= 0;
  };

  const onChange = (value: number | null, priorityKey: string, reset = false) => {
    formData[priorityKey] = value;

    setFormData(formData);
    if (reset) {
      setKeys({
        ...keys,
        [priorityKey]: generateUUID(),
      });
    }
  };

  const onreset = (priorityKey: string) => {
    formData[priorityKey] = getNum(priority[priority]);
    setFormData({ ...formData });
  };

  const handleClose = () => {
    setFormData({} as Priority);
    closeGenericDialog();
  };

  const handleSubmit = async () => {
    try {
      setConfirmLoading(true);
      await setPriority({
        ...priority,
        ...formData,
      });
      handleClose();
    } finally {
      setConfirmLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      initialFormValues();
    }
  }, [open, priority]);

  const materialTheme = createTheme({
    palette: {
      type: theme.isDark ? 'dark' : 'light',
    },
  });

  const styles = getStyles();

  return (
    <ThemeProvider theme={materialTheme}>
      {renderPanelType([PanelType.SLIDER]) && (
        <Grid container spacing={2}>
          {Object.keys(formData).map((priorityKey: string) => (
            <Grid item xs={12} sm={6} key={priority[priorityKey]}>
              <Card variant="outlined">
                <InlineLabel>
                  {getKeyLabel(priorityKey)}
                  <TextButton variant="text" onClick={() => onChange(null, priorityKey, true)}>
                    Clear
                  </TextButton>
                </InlineLabel>
                <SliderPanelComponent
                  key={keys[priorityKey]}
                  size="small"
                  isEditPanel
                  setCurrentValue={(value: any) => onChange(value, priorityKey)}
                  onResetValue={() => onreset(priorityKey)}
                  originalValue={getNum(priority[priorityKey])}
                  {...props}
                  options={{
                    ...options,
                    sliderWidth: '95%',
                    overrideSliderSettings: true,
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {renderPanelType([PanelType.SINGLESTAT, PanelType.DISPLAY, PanelType.NUMERICFIELDWRITER]) && (
        <Grid container spacing={2}>
          {Object.keys(formData).map((priorityKey: string) => (
            <Grid item xs={6} sm={3} key={priorityKey}>
              <InlineField labelWidth={6} label={getKeyLabel(priorityKey)}>
                <Input
                  placeholder={priorityKey}
                  key={keys[priorityKey]}
                  type="number"
                  defaultValue={formData[priorityKey]}
                  onChange={function (v) {
                    // @ts-ignore
                    return onChange(parseInt(v.nativeEvent.target?.value, 10), priorityKey);
                  }}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  suffix={<IconButton name="trash-alt" onClick={() => onChange(null, priorityKey, true)} />}
                />
              </InlineField>
            </Grid>
          ))}
        </Grid>
      )}
      {renderPanelType([PanelType.SWITCH]) && (
        <Grid container spacing={2}>
          {Object.keys(formData).map((priorityKey: string) => (
            <Grid item xs={6} sm={3} key={getKeyLabel(priorityKey)}>
              <HorizontalGroup wrap={false}>
                <InlineLabel width={6}>{priorityKey}</InlineLabel>
                <SwitchPanelComponent
                  key={keys[priorityKey]}
                  isEditPanel
                  onSetValue={(value: any) => onChange(value, priorityKey)}
                  originalValue={getNum(priority[priorityKey])}
                  {...props}
                  options={{
                    ...options,
                    height: 24,
                    width: 46,
                  }}
                />
                <IconButton name="trash-alt" onClick={() => onChange(null, priorityKey, true)} />
              </HorizontalGroup>
            </Grid>
          ))}
        </Grid>
      )}
      {renderPanelType([PanelType.MULTISWITCH]) && (
        <Grid container spacing={2}>
          {Object.keys(formData).map((priorityKey: string) => (
            <Grid item xs={12} sm={6} key={priorityKey}>
              <Card variant="outlined">
                <InlineLabel>
                  {getKeyLabel(priorityKey)}
                  <TextButton variant="text" onClick={() => onChange(null, priorityKey, true)}>
                    Clear
                  </TextButton>
                </InlineLabel>
                <MultiSwitchPanelComponent
                  key={keys[priorityKey]}
                  size="small"
                  isEditPanel
                  multiSwitchTab={options.multiSwitchTab}
                  onSetValue={(value: any) => onChange(value, priorityKey)}
                  onResetValue={() => onreset(priorityKey)}
                  originalValue={getNum(priority[priorityKey])}
                  {...props}
                  options={{
                    ...options,
                    sliderWidth: '95%',
                    overrideSliderSettings: true,
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <ButtonGroup style={{ float: 'right', marginTop: 12, marginRight: 4 }}>
        <Button onClick={handleSubmit}>Save</Button>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </ButtonGroup>
      {confirmLoading && (
        <div className={styles.overlayRunning}>
          <LoadingPlaceholder />
        </div>
      )}
    </ThemeProvider>
  );
};

const getStyles = stylesFactory(() => {
  return {
    overlayRunning: css`
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: black;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    `,
  };
});
