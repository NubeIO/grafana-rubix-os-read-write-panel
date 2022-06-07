import React from 'react';
import { css } from 'emotion';
import { stylesFactory } from '@grafana/ui';

interface TitleValueProps {
  title: string;
  value: string;
}

const TitleValueUi: React.FC<TitleValueProps> = (props: TitleValueProps) => {
  const { title, value } = props;
  const styles = getStyles();
  return (
    <span className={styles.titleValueContainer}>
      <span className={styles.title}>{title}</span>
      <span className={styles.value}>{value}</span>
    </span>
  );
};

const getStyles = stylesFactory(() => {
  return {
    titleValueContainer: css`
      display: flex;
      flex-direction: column;
    `,
    title: css`
      font-weight: 500;
      font-size: 10px;
    `,
    value: css`
      font-size: 12px;
    `,
  };
});

export default TitleValueUi;
