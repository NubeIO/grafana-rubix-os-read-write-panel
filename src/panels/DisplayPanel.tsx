import React, { useEffect, useState } from 'react';
import _get from 'lodash.get';
import { stylesFactory } from '@grafana/ui';
import { css } from 'emotion';
import { PanelProps } from '../types/panelProps';
import { withWriter } from '../hoc/withWriters';

const getStyles = stylesFactory(() => {
  return {
    container: css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
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
      width: 100%;
    `,
    textCenter: css`
      text-align: center;
    `,
    value: css`
      font-size: 5em;
    `,
  };
});

function DisplayPanel(props: PanelProps) {
  const { data } = props;
  const styles = getStyles();
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [point, setPoint] = useState({} as any);

  useEffect(() => {
    const series = _get(data, 'series', []);
    if (series.length) {
      const currentIdx = series.length - 1;
      const timeFieldValue = _get(series, `${currentIdx}.fields[0].values.buffer[0]`, null);
      const fieldValue = _get(series, `${currentIdx}.fields[1].values.buffer[0]`, null);
      const _time = new Date(timeFieldValue).toLocaleTimeString();
      setTime(_time);
      setPoint(fieldValue);
    }
  }, [data]);

  if (!point) {
    return (
      <div className={styles.container}>
        <p className={styles.warningText}>Please select a writer from appropriate data source!</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className="left-container">
        <p className={styles.title}>Point</p>
        <h3>{point?.name}</h3>
        <p className={styles.title}>Point Details</p>
        <p>{point?.uuid}</p>
        <p className={styles.title}>Updated At</p>
        <p>{time}</p>
      </div>
      <div className="right-container">
        <p className={styles.title}>Present Value</p>
        <span className={styles.value}>{point?.present_value}</span>
      </div>
    </div>
  );
}

export default withWriter(DisplayPanel);
