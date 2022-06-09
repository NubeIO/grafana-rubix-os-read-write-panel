import React from 'react';
import { StandardEditorProps } from '@grafana/data';
import { Slider } from '@grafana/ui';

export const SliderEditor: React.FC<StandardEditorProps<any, any>> = props => {
  return (
    <div style={{ marginRight: 15 }}>
      <Slider
        tooltipAlwaysVisible={false}
        min={0}
        max={100}
        onAfterChange={values => {
          props.onChange(values[0]);
        }}
        value={[props?.value]}
      />
    </div>
  );
};
