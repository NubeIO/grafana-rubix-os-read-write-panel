import React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Slider } from '@grafana/ui';

export const SliderEditor: React.FC<StandardEditorProps> = (props) => {
  return (
    <div style={{ marginRight: 15 }}>
      <Slider
        tooltipAlwaysVisible={false}
        min={0}
        max={100}
        onAfterChange={(values) => {
          props.onChange(values);
        }}
        value={props?.value}
      />
    </div>
  );
};
