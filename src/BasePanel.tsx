import React, { useEffect, useState } from 'react';
import { css, cx } from 'emotion';
import { PanelOptions } from './types';
import { PanelProps } from '@grafana/data';
import { stylesFactory } from '@grafana/ui';
import { Z_INDEX_OVERLAY, Z_INDEX_WRITER } from './constants/ui';

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

export const BasePanel: React.FC<Props> = (props: Props) => {
  const [dataSources, setDataSources] = useState<any>([]);
  const { data, width, height } = props;
  const styles = getStyles();

  useEffect(() => {}, [data]);

  useEffect(() => {
    setDataSources(dataSources);
  });

  const computedWrapperClassname = cx(
    styles.wrapper,
    css`
      width: ${width}px;
      height: ${height}px;
    `
  );
  return (
    <>
      <div className={computedWrapperClassname}> helloworld</div>
    </>
  );
};
