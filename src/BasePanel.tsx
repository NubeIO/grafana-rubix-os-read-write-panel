import React, { useEffect, useState } from 'react';
import { css, cx } from 'emotion';
import { AppEvents, PanelData, PanelProps } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import {
  HorizontalGroup,
  Icon,
  IconButton,
  LoadingPlaceholder,
  stylesFactory,
  Tag,
  Tooltip,
  VerticalGroup,
} from '@grafana/ui';
import { Z_INDEX_BACKGROUND, Z_INDEX_OVERLAY, Z_INDEX_WRITER } from './constants/ui';
import {
  MultiSwitchPanel,
  NumericFieldWriterPanel,
  SingleStatPanel,
  SliderPanel,
  SwitchPanel,
  DisplayPanel,
} from './panels';
import {
  BISettingsProps,
  ButtonColorSettings,
  PanelOptions,
  PanelType,
  Priority,
  SliderColorSettings,
  SwitchColorSettings,
  TextSettings,
} from './types';
import withGenericDialog from 'components/dialog/withGenericDialog';
import { WritePointValueModal } from 'components/write-point-value';
import { DIALOG_NAMES } from 'constants/dialogNames';
import * as writerUiService from './services/writerUiService';
import _ from 'lodash';
// @ts-ignore
import appEvents from 'grafana/app/core/app_events';
import { generateUUID } from 'utils/uuid';

interface Props extends PanelProps<PanelOptions> {
  openGenericDialog: Function;
}

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
    // height: '40px',
  },
  slider: {
    color: sliderColorSettings.sliderColor,
  },
});

const RUBIX_FRAMEWORK_DATASOURCE_ID = 'grafana-rubix-os-data-source';

const defaultTextSettings = {
  textSize: 40,
  unitSize: 20,
  unitColor: '#000',
};

const defaultButtonStyle = {
  activeButtonColor: '#303F9F',
  activeButtonTextColor: '#E0E0E0',
  inactiveButtonColor: '#E0E0E0',
  inactiveButtonTextColor: '#AEAEAE',
};

const defaultSliderColorSettings = {
  sliderColor: '#303F9F',
};

const defaultSwitchColorSettings = {
  switchTrueColor: '#52D869',
  switchFalseColor: '#7E7E7E',
};

const defaultBiSettings = {
  opacity: 0,
  scale: 0,
  xPosition: 0,
  yPosition: 0,
};

function fetchPriority(value: PanelData): Priority {
  const writerValue = writerUiService.getFieldValue(writerUiService.dataFieldKeys.WRITER, value);
  return writerValue?.priority;
}

function fetchWriterPriority(value: PanelData): string {
  const writerValue = writerUiService.getFieldValue(writerUiService.dataFieldKeys.WRITER, value);
  return writerValue?.current_priority?.toString();
}

const _BasePanel: React.FC<Props> = (props: Props) => {
  const styles = getStyles();

  const [isDatasourceConfigured, changeIsDatasourceConfigured] = useState(false);
  const { data: value, width, fieldConfig, height, options, openGenericDialog } = props;
  const { panelType, overrideBISettings, backgroundImageURL } = options;
  const [dataSource, setDataSource] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);
  const [currentPanelType, updatePanelType] = useState<string>(panelType);
  const [switchColorSettings, setSwitchColorSettings] = useState<SwitchColorSettings>(defaultSwitchColorSettings);
  const [buttonStyle, setButtonStyle] = useState<ButtonColorSettings>(defaultButtonStyle);
  const [sliderColorSettings, setSliderColorSettings] = useState<SliderColorSettings>(defaultSliderColorSettings);
  const [textSettings, setTextSettings] = useState<TextSettings>(defaultTextSettings);
  const [_BISettings, setBISettings] = useState<BISettingsProps>(defaultBiSettings);
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0);
  const [xPosition, setXPosition] = useState(0);
  const [yPosition, setYPosition] = useState(0);
  const [data, setData] = useState(value);
  const [priority, setPriority] = useState(fetchPriority(data));
  const [key, setKey] = useState(generateUUID());
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
      setData(value);
      setPriority(fetchPriority(data));
      return;
    }
    const datasources = data?.request?.targets.map((x) => x.datasource);

    if (Array.isArray(datasources) && datasources.length > 0) {
      datasources.map((datasource) => {
        return getDataSourceSrv()
          .get(datasource)
          .then((res) => {
            if (res.meta.id === RUBIX_FRAMEWORK_DATASOURCE_ID) {
              setDataSource(res);
              changeIsDatasourceConfigured(true);
              updateUiConfig(res);
            } else {
              changeIsDatasourceConfigured(false);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      });
    }
  }, [value]);

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
    const { switchColorSettings, sliderColorSettings, _BISettings, multiSwitchButtonStyle } = res;
    const { numericFieldWriterButtonStyle, sliderButtonStyle, textSettings } = res;
    setSwitchColorSettings(switchColorSettings);
    const { panelType } = options;
    if (panelType === PanelType.MULTISWITCH) {
      setButtonStyle(multiSwitchButtonStyle);
    } else if (panelType === PanelType.NUMERICFIELDWRITER) {
      setButtonStyle(numericFieldWriterButtonStyle);
    } else if (panelType === PanelType.SLIDER) {
      setButtonStyle(sliderButtonStyle);
    }
    setSliderColorSettings(sliderColorSettings);
    setTextSettings(textSettings);
    setBISettings(_BISettings);
  };

  const openPriorityWriter = () => {
    const fields = props?.data?.series[0]?.fields[1];
    //@ts-ignore
    const value = fields?.values?.buffer[0];

    openGenericDialog(DIALOG_NAMES.writePointDialog, {
      title: 'Write Priority Array',
      icon: 'cloud-upload',
      panelType: currentPanelType,
      priority: priority,
      options: options,
      customStyles: customStyles,
      fieldConfig: fieldConfig.defaults,
      switchColorSettings: switchColorSettings,
      multiSwitchTab: options.multiSwitchTab,
      dialogBody: WritePointValueModal,
      setPriority: onSetPriority,
      display: fields?.display,
    });
  };

  const onSetPriority = async (value: Priority) => {
    const payload = writerUiService.constructWriterPayload(value);
    const writerValue = writerUiService.getFieldValue(writerUiService.dataFieldKeys.WRITER, data) as any;
    const writerUUID = writerValue.uuid;
    const hostUUID = writerValue.host_uuid;
    // todo
    if (typeof dataSource.services?.pointsService?.createPointPriorityArray === 'function') {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }

    return await dataSource.services?.pointsService
      ?.createPointPriorityArray(writerUUID, hostUUID, payload)
      .then(async (res: any) => {
        await onGetValue();
        setKey(generateUUID());
        appEvents.emit(AppEvents.alertSuccess, [`Point value set to ${value}`]);
      })
      .catch(() => {
        appEvents.emit(AppEvents.alertError, ['Unsuccessful to set writer value!']);
      })
      .finally(() => {
        setIsRunning(false);
      });
  };

  const onGetValue = async () => {
    const series = _.get(data, 'series', []);
    if (!series.length) {
      return;
    }
    const writerValue = await writerUiService.getFieldValue(writerUiService.dataFieldKeys.WRITER, data);
    const writerUUID = writerValue.uuid;
    const hostUUID = writerValue.host_uuid;

    if (typeof dataSource.services?.pointsService?.fetchByPointUUID === 'function') {
      setIsRunning(true);
      return dataSource.services?.pointsService
        ?.fetchByPointUUID(writerUUID, hostUUID, true)
        .then((res: any) => {
          const result = _.set(data, 'series[0].fields[1].values.buffer[0]', { ...res, host_uuid: hostUUID });

          setData(result);
          setPriority(res.priority);
        })
        .catch(() => {})
        .finally(() => {
          setIsRunning(false);
        });
    }
  };

  const currentPriority = writerUiService.getFieldValue(writerUiService.dataFieldKeys.PRIORITY, data)?.displayName;
  const writerPriority = fetchWriterPriority(data) ?? currentPriority;

  return (
    <div className={computedWrapperClassname}>
      <div style={{ float: 'right', transform: 'translate(-12px, -32px)' }}>
        <HorizontalGroup>
          <IconButton name="cloud-upload" size="lg" key="cloud-upload" onClick={openPriorityWriter} />
        </HorizontalGroup>
      </div>
      {renderPanelType(PanelType.DISPLAY) && (
        <DisplayPanel
          key={key}
          data={data}
          options={options}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          fieldConfig={fieldConfig.defaults}
          phyWriterMap={dataSource.flowNetworksPhyDevices}
          services={dataSource.services}
          onGetValue={onGetValue}
        />
      )}
      {renderPanelType(PanelType.SLIDER) && (
        <SliderPanel
          key={key}
          data={data}
          options={options}
          isRunning={isRunning}
          customStyles={customStyles}
          setIsRunning={setIsRunning}
          services={dataSource.services}
          fieldConfig={fieldConfig.defaults}
          phyWriterMap={dataSource.flowNetworksPhyDevices}
          onGetValue={onGetValue}
        />
      )}
      {renderPanelType(PanelType.SINGLESTAT) && (
        <SingleStatPanel
          key={key}
          data={data}
          options={options}
          isRunning={isRunning}
          textSettings={textSettings}
          setIsRunning={setIsRunning}
          services={dataSource.services}
          fieldConfig={fieldConfig.defaults}
          phyWriterMap={dataSource.flowNetworksPhyDevices}
          onGetValue={onGetValue}
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
          multiSwitchTab={options.multiSwitchTab}
          phyWriterMap={dataSource.flowNetworksPhyDevices}
          onGetValue={onGetValue}
        />
      )}
      {renderPanelType(PanelType.SWITCH) && (
        <SwitchPanel
          key={key}
          data={data}
          options={options}
          isRunning={isRunning}
          customStyles={customStyles}
          setIsRunning={setIsRunning}
          services={dataSource.services}
          fieldConfig={fieldConfig.defaults}
          switchColorSettings={switchColorSettings}
          phyWriterMap={dataSource.flowNetworksPhyDevices}
          onGetValue={onGetValue}
        />
      )}
      {renderPanelType(PanelType.NUMERICFIELDWRITER) && (
        <NumericFieldWriterPanel
          data={data}
          options={options}
          isRunning={isRunning}
          customStyles={customStyles}
          setIsRunning={setIsRunning}
          services={dataSource.services}
          fieldConfig={fieldConfig.defaults}
          phyWriterMap={dataSource.flowNetworksPhyDevices}
          onGetValue={onGetValue}
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
      <InfoHeader currentPriority={currentPriority} writerPriority={writerPriority} />
      {!isDatasourceConfigured && <div>Selected datasource is not correct!</div>}
      {isRunning && (
        <div className={styles.overlayRunning}>
          <LoadingPlaceholder />
        </div>
      )}
    </div>
  );
};

interface InfoHeaderProps {
  writerPriority: string;
  currentPriority: string;
}

function InfoHeader(props: InfoHeaderProps) {
  const { writerPriority, currentPriority } = props;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        transform: 'translate(0, -30px)',
      }}
    >
      <Tooltip
        content={
          <VerticalGroup>
            <HorizontalGroup>
              {writerPriority !== currentPriority ? 'Read Priority:' : 'Read/Write Priority:'}
              <Tag name={writerPriority} colorIndex={5} />
            </HorizontalGroup>
            {writerPriority !== currentPriority && (
              <HorizontalGroup>
                Write Priority:
                <Tag name={currentPriority} colorIndex={7} />
              </HorizontalGroup>
            )}
          </VerticalGroup>
        }
      >
        <Icon name="info-circle" style={{ color: writerPriority !== currentPriority ? 'orange' : 'currentColor' }} />
      </Tooltip>
    </div>
  );
}

export const BasePanel = withGenericDialog(_BasePanel);
