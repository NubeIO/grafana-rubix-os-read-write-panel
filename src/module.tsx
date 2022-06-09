import * as React from 'react';
import { PanelOptions, PanelType, PanelTypeLabel, CategoryType } from './types';
import { SliderEditor } from './components/SliderEditor';
import { PanelPlugin } from '@grafana/data';
import { BasePanel } from './BasePanel';
import { ColorPicker } from '@grafana/ui';

const datePickerStyle = { display: 'flex', alignItems: 'center', height: '32px' };

export const plugin = new PanelPlugin<PanelOptions>(BasePanel)
  .setPanelOptions(builder => {
    return builder
      .addSelect({
        path: 'panelType',
        name: 'Panel Type',
        settings: {
          options: [
            { value: PanelType.SLIDER, label: PanelTypeLabel[PanelType.SLIDER] },
            { value: PanelType.DISPLAY, label: PanelTypeLabel[PanelType.DISPLAY] },
          ],
        },
        defaultValue: PanelType.DISPLAY,
      })
      .addBooleanSwitch({
        path: 'overrideButtonColorSettings',
        name: 'Override Button Color Settings',
        defaultValue: false,
        category: [CategoryType.ButtonColorSettings],
        showIf: (currentConfig: PanelOptions) => {
          return [PanelType.SLIDER].includes(currentConfig.panelType);
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
          return [PanelType.SLIDER].includes(currentConfig.panelType) && currentConfig.overrideButtonColorSettings;
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
          return [PanelType.SLIDER].includes(currentConfig.panelType) && currentConfig.overrideButtonColorSettings;
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
          return [PanelType.SLIDER].includes(currentConfig.panelType) && currentConfig.overrideButtonColorSettings;
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
          return [PanelType.SLIDER].includes(currentConfig.panelType) && currentConfig.overrideButtonColorSettings;
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
