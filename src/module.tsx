import { PanelOptions } from './types';
import { PanelPlugin } from '@grafana/data';
import { BasePanel } from './BasePanel';

export const plugin = new PanelPlugin<PanelOptions>(BasePanel)
