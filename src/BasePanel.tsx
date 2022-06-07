import _get from 'lodash.get';
import React, { useEffect, useState } from 'react';
import { css, cx } from 'emotion';
import { PanelOptions } from './types';
import { PanelProps } from '@grafana/data';
import { getDataSourceSrv } from '@grafana/runtime';
import { stylesFactory } from '@grafana/ui';
import { Z_INDEX_OVERLAY, Z_INDEX_WRITER } from './constants/ui'
import WriterDisplayPanel from './components/WriterDisplayPanel';

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

const RUBIX_SERVICE_DATASOURCE_ID = 'nubeio-rubix-service-data-source';

export const BasePanel: React.FC<Props> = (props: Props) => {
  const [dataSource, setDataSource] = useState<any>({});
  const [isDatasourceConfigured, changeIsDatasourceConfigured] = useState(false);

  const { data, width, height } = props;
  const styles = getStyles();

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
  return (
    <>
      <div className={computedWrapperClassname}>
        {isDatasourceConfigured && (
          <WriterDisplayPanel
            data={data}
            phyWriterMap={dataSource.flowNetworksPhyDevices}
            service={dataSource.services.rfWriterService}
          />
        )}
        {!isDatasourceConfigured && <div>Selected datasource is not correct!</div>}
      </div>
    </>
  );
};
