export enum MultiSwitchType {
  BUTTON = 'button',
  DROPDOWN = 'dropdown',
}

export interface MultiSwitchTabDataType {
  [id: number]: {
    name: string;
    value: any;
  };
}

export interface MultiSwitchTabType {
  type: MultiSwitchType;
  data: MultiSwitchTabDataType;
}

export interface MultiSwitchOptions {
  multiSwitchTab?: MultiSwitchTabType;
}

export interface SliderOptions {
  overrideSliderSettings?: boolean;
  sliderColor?: string;
}

export enum PanelType {
  DISPLAY = 'display',
  MULTISWITCH = 'multiSwitch',
  SLIDER = 'slider',
  SWITCH = 'switch',
  NUMERICFIELDWRITER = 'numericFieldWriter',
}

export const PanelTypeLabel = {
  [PanelType.DISPLAY]: 'Display Panel',
  [PanelType.SLIDER]: 'Slider',
  [PanelType.MULTISWITCH]: 'Multi Switch',
  [PanelType.SWITCH]: 'Switch',
  [PanelType.NUMERICFIELDWRITER]: 'Numeric Field',
};

export interface ButtonColorSettings {
  activeButtonColor: string;
  activeButtonTextColor: string;
  inactiveButtonColor: string;
  inactiveButtonTextColor: string;
}

export interface BackgroundOptions {
  backgroundImageURL: string;
  overrideBISettings: boolean;
  opacity?: number;
  scale?: number;
  xPosition?: number;
  yPosition?: number;
}

export interface ButtonOptions {
  overrideButtonColorSettings?: boolean;
  activeButtonColor?: string;
  activeButtonTextColor?: string;
  inactiveButtonColor?: string;
  inactiveButtonTextColor?: string;
}

export interface SliderColorSettings {
  sliderColor: string;
}

export interface BISettingsProps {
  opacity: number;
  scale: number;
  xPosition: number;
  yPosition: number;
}

export interface BackgroundOptions {
  backgroundImageURL: string;
  overrideBISettings: boolean;
  opacity?: number;
  scale?: number;
  xPosition?: number;
  yPosition?: number;
}

export interface DataFieldKeyI {
  [key: string]: string;
}

export enum CategoryType {
  Background = 'Background',
  NumericSettings = 'Numeric Settings',
  MultiSwitchSettings = 'Multi Switch Settings',
  SwitchColorSettings = 'Switch Color Settings',
  ButtonColorSettings = 'Button Color Settings',
  SliderColorSettings = 'Slider Color Settings',
}

export interface SwitchOptions {
  overrideSwitchColorSettings?: boolean;
  switchTrueColor?: string;
  switchFalseColor?: string;
}

export interface SwitchColorSettings {
  switchTrueColor: string;
  switchFalseColor: string;
}

export interface NumericOptions {
  step?: number;
}

export interface PanelOptions
  extends MultiSwitchOptions,
    ButtonOptions,
    SliderOptions,
    BackgroundOptions,
    BackgroundOptions,
    NumericOptions,
    SwitchOptions {
  panelType: PanelType;
}
