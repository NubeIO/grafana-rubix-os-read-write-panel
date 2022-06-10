import _get from 'lodash.get';
import React, { useEffect, useState } from 'react';
import { css, cx } from 'emotion';
import { PanelProps } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { stylesFactory } from '@grafana/ui';
import { Z_INDEX_BACKGROUND, Z_INDEX_OVERLAY, Z_INDEX_WRITER } from './constants/ui';
import WriterDisplayPanel from './components/WriterDisplayPanel';
import SliderPanel from './components/SliderPanel';
import MultiSwitchPanel from './panels/MultiSwitch';
import { PanelOptions, PanelType, ButtonColorSettings, SliderColorSettings, BISettingsProps } from './types';

interface Props extends PanelProps<PanelOptions> {}

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
      z-index: ${Z_INDEX_WRITER};
    `,
    overlay: css`
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: ${Z_INDEX_OVERLAY};
      transparent: 100%;
    `,
    spinner: css`
      position: absolute;
      top: -32px;
      right: -2px;
    `,
  };
});

const getCustomStyles = ({ options, buttonStyle, sliderColorSettings }: any) => ({
  button: {
    background: options?.overrideButtonColorSettings
      ? `${options?.activeButtonColor} !important`
      : `${buttonStyle?.activeButtonColor} !important`,
    color: options?.overrideButtonColorSettings
      ? `${options?.activeButtonTextColor} !important`
      : `${buttonStyle?.activeButtonTextColor} !important`,
    '&:disabled': {
      background: options?.overrideButtonColorSettings
        ? `${options?.inactiveButtonColor} !important`
        : `${buttonStyle?.inactiveButtonColor} !important`,
      color: options?.overrideButtonColorSettings
        ? `${options?.inactiveButtonTextColor} !important`
        : `${buttonStyle?.inactiveButtonTextColor} !important`,
    },
    fontSize: '16px',
    height: '40px',
  },
  slider: {
    color: sliderColorSettings.sliderColor,
  },
});

const RUBIX_SERVICE_DATASOURCE_ID = 'nubeio-rubix-service-data-source';
const defaultButtonStyle = {
  activeButtonColor: '#303F9F',
  activeButtonTextColor: '#E0E0E0',
  inactiveButtonColor: '#E0E0E0',
  inactiveButtonTextColor: '#AEAEAE',
};
const defaultSliderConfig = {
  sliderColor: '#303F9F',
};

const defaultBiSettings = {
  opacity: 0,
  scale: 0,
  xPosition: 0,
  yPosition: 0,
};

export const BasePanel: React.FC<Props> = (props: Props) => {
  const styles = getStyles();

  const [isDatasourceConfigured, changeIsDatasourceConfigured] = useState(false);
  const { data, width, fieldConfig, height, options } = props;
  const { panelType, overrideBISettings, backgroundImageURL } = options;
  const [dataSource, setDataSource] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);
  const [currentPanelType, updatePanelType] = useState<string>(panelType);
  const [buttonStyle, setButtonStyle] = useState<ButtonColorSettings>(defaultButtonStyle);
  const [sliderColorSettings, setSliderColorSettings] = useState<SliderColorSettings>(defaultSliderConfig);
  const [_BISettings, setBISettings] = useState<BISettingsProps>(defaultBiSettings);
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0);
  const [xPosition, setXPosition] = useState(0);
  const [yPosition, setYPosition] = useState(0);

  const customStyles = getCustomStyles({ options, buttonStyle, sliderColorSettings });

  useEffect(() => {
    updatePanelType(panelType);
  }, [panelType]);

  useEffect(() => {
    if (!overrideBISettings) {
      setOpacity(_BISettings.opacity);
      setScale(_BISettings.scale);
      setXPosition(_BISettings.xPosition);
      setYPosition(_BISettings.yPosition);
    } else {
      setOpacity(options?.opacity || 30);
      setScale(options?.scale || 30);
      setXPosition(options?.xPosition || 100);
      setYPosition(options?.yPosition || 0);
    }
  }, [overrideBISettings, _BISettings, options]);

  useEffect(() => {
    if (isDatasourceConfigured) {
      return;
    }
    getDataSourceSrv()
      .get()
      .then(res => {
        if (res.meta.id == RUBIX_SERVICE_DATASOURCE_ID) {
          // correctly configured
          setDataSource(res);
          changeIsDatasourceConfigured(true);
          updateUiConfig(res);
        } else {
          changeIsDatasourceConfigured(false);
        }
      });
  }, [data]);

  const computedWrapperClassname = cx(
    styles.wrapper,
    css`
      width: ${width}px;
      height: ${height}px;
    `
  );
  const renderPanelType = (panelType: PanelType) => {
    return isDatasourceConfigured && panelType === currentPanelType;
  };

  const updateUiConfig = (res: any = {}) => {
    if (res._BISettings) {
      setBISettings(res._BISettings);
    }
    if (res.sliderColorSettings) {
      setSliderColorSettings(res.sliderColorSettings);
    }
    switch (currentPanelType) {
      case PanelType.SLIDER:
        setButtonStyle(res.sliderButtonStyle);
        break;
    }
  };

  return (
    <>
      <div className={computedWrapperClassname}>
        {renderPanelType(PanelType.DISPLAY) && (
          <WriterDisplayPanel
            data={data}
            options={options}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            fieldConfig={fieldConfig.defaults}
            phyWriterMap={dataSource.flowNetworksPhyDevices}
            services={dataSource.services}
          />
        )}
        {renderPanelType(PanelType.SLIDER) && (
          <SliderPanel
            data={data}
            options={options}
            isRunning={isRunning}
            customStyles={customStyles}
            setIsRunning={setIsRunning}
            services={dataSource.services}
            fieldConfig={fieldConfig.defaults}
            phyWriterMap={dataSource.flowNetworksPhyDevices}
          />
        )}
        {renderPanelType(PanelType.MULTISWITCH) && (
          <MultiSwitchPanel
            data={data}
            options={options}
            isRunning={isRunning}
            customStyles={customStyles}
            setIsRunning={setIsRunning}
            services={dataSource.services}
            fieldConfig={fieldConfig.defaults}
            phyWriterMap={dataSource.flowNetworksPhyDevices}
          />
        )}
        {backgroundImageURL && (
          <div
            style={{
              position: 'absolute',
              zIndex: Z_INDEX_BACKGROUND,
              bottom: `${yPosition}%`,
              transform: `translateX(-${xPosition}%) translateY(${yPosition}%)`,
              left: `${xPosition}%`,
              opacity: opacity / 100,
              width: `${scale}%`,
              height: `${scale}%`,
              backgroundImage: `url(${backgroundImageURL})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: `${xPosition}% ${100 - yPosition}%`,
            }}
          />
        )}
        {!isDatasourceConfigured && <div>Selected datasource is not correct!</div>}
      </div>
    </>
  );
};
