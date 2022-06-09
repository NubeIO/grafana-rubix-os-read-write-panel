import { PanelData } from '@grafana/data';
import { FieldConfig } from '@grafana/data';
import { PanelOptions } from '../types';
export interface RubixServiceObject {
  uuid: string;
  name: string;
}

export interface PhysicalWriterMap {
  [writer_thing_uuid: string]: {
    network: RubixServiceObject;
    point: RubixServiceObject;
    device: RubixServiceObject;
  };
}

export interface BaseService {
  get: Promise<any>;
  put: Promise<any>;
  post: Promise<any>;
  delete: Promise<any>;
}

export interface ServicesI {
  [serviceName: string]: Function;
}

export interface PanelProps {
  data: PanelData;
  isRunning: boolean;
  options?: PanelOptions;
  services: any;
  fieldConfig?: FieldConfig;
  phyWriterMap: PhysicalWriterMap;
  setIsRunning: (val: boolean) => void;
}
