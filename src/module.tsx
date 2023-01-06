import * as React from 'react';
import { CategoryType, Image, PanelOptions, PanelType, PanelTypeLabel } from './types';
import { SliderEditor } from './components/SliderEditor';
import { PanelPlugin } from '@grafana/data';
import { BasePanel } from './BasePanel';
import { ColorPicker } from '@grafana/ui';
import { MultiSwitchTab } from './components/MultiSwitchTab';

const customButtonSupportablePanelType = [PanelType.SLIDER, PanelType.MULTISWITCH, PanelType.NUMERICFIELDWRITER];

export const plugin = new PanelPlugin<PanelOptions>(BasePanel)
  .setPanelOptions(builder => {
    const datePickerStyle = { display: 'flex', alignItems: 'center', height: '32px' };

    return builder
      .addSelect({
        path: 'panelType',
        name: 'Panel Type',
        settings: {
          options: [
            { value: PanelType.SLIDER, label: PanelTypeLabel[PanelType.SLIDER] },
            { value: PanelType.SINGLESTAT, label: PanelTypeLabel[PanelType.SINGLESTAT] },
            { value: PanelType.DISPLAY, label: PanelTypeLabel[PanelType.DISPLAY] },
            { value: PanelType.MULTISWITCH, label: PanelTypeLabel[PanelType.MULTISWITCH] },
            { value: PanelType.SWITCH, label: PanelTypeLabel[PanelType.SWITCH] },
            { value: PanelType.NUMERICFIELDWRITER, label: PanelTypeLabel[PanelType.NUMERICFIELDWRITER] },
          ],
        },
        defaultValue: PanelType.DISPLAY,
      })
      .addCustomEditor({
        id: 'multiSwitchTab',
        path: 'multiSwitchTab',
        name: 'Number of Count',
        category: [CategoryType.MultiSwitchSettings],
        editor: props => {
          return <MultiSwitchTab {...props} />;
        },

        showIf: (currentConfig: PanelOptions) => {
          return currentConfig.panelType === PanelType.MULTISWITCH;
        },
      })

      .addSelect({
        path: 'image',
        name: 'Image',
        settings: {
          options: [
            { value: Image.NoImage, label: Image.NoImage },
            { value: Image.Light, label: Image.Light },
            { value: Image.Fan, label: Image.Fan },
            { value: Image.Cooling, label: Image.Cooling },
            { value: Image.Heating, label: Image.Heating },
            { value: Image.Alert, label: Image.Alert },
          ],
        },
        defaultValue: Image.NoImage,
        category: [CategoryType.SingleStat],
        showIf: (currentConfig: PanelOptions) => {
          return currentConfig.panelType === PanelType.SINGLESTAT;
        },
      })
      .addBooleanSwitch({
        path: 'showValue',
        name: 'Show Value (on Top)',
        defaultValue: true,
        category: [CategoryType.SingleStat],
        showIf: (currentConfig: PanelOptions) => {
          return currentConfig.panelType === PanelType.SINGLESTAT && currentConfig.image !== Image.NoImage;
        },
      })
      .addBooleanSwitch({
        path: 'overrideValue',
        name: 'Override Value',
        defaultValue: false,
        category: [CategoryType.SingleStat],
        showIf: (currentConfig: PanelOptions) => {
          return (
            currentConfig.panelType === PanelType.SINGLESTAT &&
            currentConfig.image !== Image.NoImage &&
            currentConfig.showValue
          );
        },
      })
      .addTextInput({
        path: 'trueValue',
        name: 'True Value',
        defaultValue: '',
        category: [CategoryType.SingleStat],
        showIf: (currentConfig: PanelOptions) => {
          return (
            currentConfig.panelType === PanelType.SINGLESTAT &&
            currentConfig.image !== Image.NoImage &&
            currentConfig.showValue &&
            currentConfig.overrideValue
          );
        },
      })
      .addTextInput({
        path: 'falseValue',
        name: 'False Value',
        defaultValue: '',
        category: [CategoryType.SingleStat],
        showIf: (currentConfig: PanelOptions) => {
          return (
            currentConfig.panelType === PanelType.SINGLESTAT &&
            currentConfig.image !== Image.NoImage &&
            currentConfig.showValue &&
            currentConfig.overrideValue
          );
        },
      })

      .addTextInput({
        path: 'unit',
        name: 'Unit',
        defaultValue: '',
        category: [CategoryType.TextSettings],
        showIf: (currentConfig: PanelOptions) => {
          return currentConfig.panelType === PanelType.SINGLESTAT;
        },
      })
      .addBooleanSwitch({
        path: 'overrideTextSettings',
        name: 'Override Text Settings',
        defaultValue: false,
        category: [CategoryType.TextSettings],
        showIf: (currentConfig: PanelOptions) => {
          return currentConfig.panelType === PanelType.SINGLESTAT;
        },
      })
      .addNumberInput({
        path: 'textSize',
        name: 'Text Size',
        defaultValue: 40,
        category: [CategoryType.TextSettings],
        showIf: (currentConfig: PanelOptions) => {
          return currentConfig.panelType === PanelType.SINGLESTAT && currentConfig.overrideTextSettings;
        },
      })
      .addNumberInput({
        path: 'unitSize',
        name: 'Unit Size',
        defaultValue: 20,
        category: [CategoryType.TextSettings],
        showIf: (currentConfig: PanelOptions) => {
          return currentConfig.panelType === PanelType.SINGLESTAT && currentConfig.overrideTextSettings;
        },
      })
      .addCustomEditor({
        id: 'textColor',
        path: 'textColor',
        name: 'Text Color',
        defaultValue: '#000',
        category: [CategoryType.TextSettings],
        editor: props => {
          return (
            <div style={datePickerStyle}>
              <ColorPicker
                color={props.value}
                onChange={color => {
                  props.onChange(color);
                }}
              />
            </div>
          );
        },
        showIf: (currentConfig: PanelOptions) => {
          return currentConfig.panelType === PanelType.SINGLESTAT && currentConfig.overrideTextSettings;
        },
      })
      .addCustomEditor({
        id: 'unitColor',
        path: 'unitColor',
        name: 'Unit Color',
        defaultValue: '#000',
        category: [CategoryType.TextSettings],
        editor: props => {
          return (
            <div style={datePickerStyle}>
              <ColorPicker
                color={props.value}
                onChange={color => {
                  props.onChange(color);
                }}
              />
            </div>
          );
        },
        showIf: (currentConfig: PanelOptions) => {
          return currentConfig.panelType === PanelType.SINGLESTAT && currentConfig.overrideTextSettings;
        },
      })

      .addNumberInput({
        path: 'step',
        name: 'Step',
        defaultValue: 1,
        category: [CategoryType.NumericSettings],
        showIf: (currentConfig: PanelOptions) => {
          return currentConfig.panelType === PanelType.NUMERICFIELDWRITER;
        },
      })

      .addBooleanSwitch({
        path: 'overrideSwitchColorSettings',
        name: 'Override Switch Color Settings',
        defaultValue: false,
        category: [CategoryType.SwitchColorSettings],
        showIf: (currentConfig: PanelOptions) => {
          return currentConfig.panelType === PanelType.SWITCH;
        },
      })
      .addCustomEditor({
        id: 'switchTrueColor',
        path: 'switchTrueColor',
        name: 'True Color',
        defaultValue: '#52D869',
        category: [CategoryType.SwitchColorSettings],
        editor: props => {
          return (
            <div style={datePickerStyle}>
              <ColorPicker
                color={props.value}
                onChange={color => {
                  props.onChange(color);
                }}
              />
            </div>
          );
        },
        showIf: (currentConfig: PanelOptions) => {
          return currentConfig.panelType === PanelType.SWITCH && currentConfig.overrideSwitchColorSettings;
        },
      })
      .addCustomEditor({
        id: 'switchFalseColor',
        path: 'switchFalseColor',
        name: 'False Color',
        defaultValue: '#7E7E7E',
        category: [CategoryType.SwitchColorSettings],
        editor: props => {
          return (
            <div style={datePickerStyle}>
              <ColorPicker
                color={props.value}
                onChange={color => {
                  props.onChange(color);
                }}
              />
            </div>
          );
        },
        showIf: (currentConfig: PanelOptions) => {
          return currentConfig.panelType === PanelType.SWITCH && currentConfig.overrideSwitchColorSettings;
        },
      })

      .addBooleanSwitch({
        path: 'overrideButtonColorSettings',
        name: 'Override Button Color Settings',
        defaultValue: false,
        category: [CategoryType.ButtonColorSettings],
        showIf: (currentConfig: PanelOptions) => {
          return customButtonSupportablePanelType.includes(currentConfig.panelType);
        },
      })
      .addCustomEditor({
        id: 'activeButtonColor',
        path: 'activeButtonColor',
        name: 'Active Button Color',
        defaultValue: '#303F9F',
        category: [CategoryType.ButtonColorSettings],
        editor: props => {
          return (
            <div style={datePickerStyle}>
              <ColorPicker
                color={props.value}
                onChange={color => {
                  props.onChange(color);
                }}
              />
            </div>
          );
        },
        showIf: (currentConfig: PanelOptions) => {
          return (
            customButtonSupportablePanelType.includes(currentConfig.panelType) &&
            currentConfig.overrideButtonColorSettings
          );
        },
      })
      .addCustomEditor({
        id: 'activeButtonTextColor',
        path: 'activeButtonTextColor',
        name: 'Active Button Text Color',
        defaultValue: '#E0E0E0',
        category: [CategoryType.ButtonColorSettings],
        editor: props => {
          return (
            <div style={datePickerStyle}>
              <ColorPicker
                color={props.value}
                onChange={color => {
                  props.onChange(color);
                }}
              />
            </div>
          );
        },
        showIf: (currentConfig: PanelOptions) => {
          return (
            customButtonSupportablePanelType.includes(currentConfig.panelType) &&
            currentConfig.overrideButtonColorSettings
          );
        },
      })
      .addCustomEditor({
        id: 'inactiveButtonColor',
        path: 'inactiveButtonColor',
        name: 'Inactive Button Color',
        defaultValue: '#E0E0E0',
        category: [CategoryType.ButtonColorSettings],
        editor: props => {
          return (
            <div style={datePickerStyle}>
              <ColorPicker
                color={props.value}
                onChange={color => {
                  props.onChange(color);
                }}
              />
            </div>
          );
        },
        showIf: (currentConfig: PanelOptions) => {
          return (
            customButtonSupportablePanelType.includes(currentConfig.panelType) &&
            currentConfig.overrideButtonColorSettings
          );
        },
      })
      .addCustomEditor({
        id: 'inactiveButtonTextColor',
        path: 'inactiveButtonTextColor',
        name: 'Inactive Button Text Color',
        defaultValue: '#AEAEAE',
        category: [CategoryType.ButtonColorSettings],
        editor: props => {
          return (
            <div style={datePickerStyle}>
              <ColorPicker
                color={props.value}
                onChange={color => {
                  props.onChange(color);
                }}
              />
            </div>
          );
        },
        showIf: (currentConfig: PanelOptions) => {
          return (
            customButtonSupportablePanelType.includes(currentConfig.panelType) &&
            currentConfig.overrideButtonColorSettings
          );
        },
      })

      .addBooleanSwitch({
        path: 'overrideSliderSettings',
        name: 'Override Slider Settings',
        defaultValue: false,
        category: [CategoryType.SliderColorSettings],
        showIf: (currentConfig: PanelOptions) => {
          return currentConfig.panelType === PanelType.SLIDER;
        },
      })
      .addCustomEditor({
        id: 'sliderColor',
        path: 'sliderColor',
        name: 'Color',
        defaultValue: '#303F9F',
        category: [CategoryType.SliderColorSettings],
        editor: props => {
          return (
            <div style={datePickerStyle}>
              <ColorPicker
                color={props.value}
                onChange={color => {
                  props.onChange(color);
                }}
              />
            </div>
          );
        },
        showIf: (currentConfig: PanelOptions) => {
          return currentConfig.panelType === PanelType.SLIDER && currentConfig.overrideSliderSettings;
        },
      })

      .addTextInput({
        path: 'backgroundImageURL',
        name: 'Background Image URL',
        defaultValue: '',
        category: [CategoryType.Background],
      })
      .addBooleanSwitch({
        path: 'overrideBISettings',
        name: 'Override Background Image Settings',
        defaultValue: false,
        category: [CategoryType.Background],
      })
      .addCustomEditor({
        id: 'opacity',
        path: 'opacity',
        name: 'Opacity',
        category: [CategoryType.Background],
        defaultValue: 30,
        editor: props => {
          return <SliderEditor {...props} />;
        },
        showIf: (currentConfig: PanelOptions) => {
          return currentConfig.overrideBISettings;
        },
      })
      .addCustomEditor({
        id: 'scale',
        path: 'scale',
        name: 'Scale',
        category: [CategoryType.Background],
        defaultValue: 30,
        editor: props => {
          return <SliderEditor {...props} />;
        },
        showIf: (currentConfig: PanelOptions) => {
          return currentConfig.overrideBISettings;
        },
      })
      .addCustomEditor({
        id: 'xPosition',
        path: 'xPosition',
        name: 'X-Position',
        category: [CategoryType.Background],
        defaultValue: 100,
        editor: props => {
          return <SliderEditor {...props} />;
        },
        showIf: (currentConfig: PanelOptions) => {
          return currentConfig.overrideBISettings;
        },
      })
      .addCustomEditor({
        id: 'yPosition',
        path: 'yPosition',
        name: 'Y-Position',
        category: [CategoryType.Background],
        defaultValue: 0,
        editor: props => {
          return <SliderEditor {...props} />;
        },
        showIf: (currentConfig: PanelOptions) => {
          return currentConfig.overrideBISettings;
        },
      });
  })

  .useFieldConfig({});
