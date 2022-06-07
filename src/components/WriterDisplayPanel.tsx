import React, { useEffect, useState } from 'react';
import _get from 'lodash.get';
import { stylesFactory } from '@grafana/ui';
import { css } from 'emotion';

import { PanelData } from '@grafana/data';

interface RubixServiceObject {
  uuid: string;
  name: string;
}

interface PhysicalWriterMap {
  [writer_thing_uuid: string]: {
    network: RubixServiceObject;
    point: RubixServiceObject;
    device: RubixServiceObject;
  };
}

interface WriterDisplayPanelProps {
  service: Function | any;
  data: PanelData;
  phyWriterMap: PhysicalWriterMap;
}

const getStyles = stylesFactory(() => {
  return {
    container: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,
    title: css`
      margin-bottom: 8px;
      font-size: 10px;
      font-weight: 500;
      color: #999;
      text-transform: uppercase;
    `,
    warningText: css`
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #999;
      text-transform: uppercase;
      text-align: center;
    `,
    textCenter: css`{
      text-align: center;
    }`,
    value: css`
      font-size: 5em;
    `,
  };
});

export const WriterDisplayPanel: React.FC<WriterDisplayPanelProps> = (props: WriterDisplayPanelProps) => {
  const { data, phyWriterMap } = props;
  const styles = getStyles();
  const series = _get(data, 'series', []);
  if (!series.length) {
    return null;
  }
  const currentIdx = series.length - 1;
  const timeFieldValue = _get(series, `${currentIdx}.fields[0].values.buffer[0]`, null);
  const fieldValue = _get(series, `${currentIdx}.fields[1].values.buffer[0]`, null);
  // const timeField = (Array.isArray(payload) && payload.length > 0 && payload[0]) || null;
  const [time, updatedTime] = useState(new Date(timeFieldValue));
  const [writer, updateWriter] = useState(fieldValue);

  const getNetworkName = (writerThingUUID: string) => {
    const phyWriterObj = phyWriterMap[writerThingUUID];
    if (!phyWriterObj) {
      return '';
    }

    return `${phyWriterObj.network.name || ''} : ${phyWriterObj.device.name || ''} ${phyWriterObj.point.name || ''}`;
  };

  const getWriterName = () => {
    if (!writer) {
      return '';
    }
    return `${writer.writer_thing_name} - ${writer.writer_thing_class}`;
  };

  useEffect(() => {
    updatedTime(new Date(timeFieldValue));
    updateWriter(fieldValue);
  }, [fieldValue, timeFieldValue]);

  if (!writer) {
    return (
      <div className={styles.container}>
        <p className={styles.warningText}>Please! selected a writer from appropriate data source.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className="left-container">
        <p className={styles.title}>Writer</p>
        <h3>{getWriterName()}</h3>
        <p className={styles.title}>Network Details</p>
        <p>{getNetworkName(writer.writer_thing_uuid)}</p>
        <p className={styles.title}>Updated At</p>
        <p>{time.toLocaleTimeString()}</p>
      </div>
      <div className="right-container">
        <p className={styles.title}>Present Value</p>
        <span className={styles.value}>{writer.present_value}</span>
      </div>
    </div>
  );
};

export default WriterDisplayPanel;
