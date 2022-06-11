import React, { useEffect, useState } from 'react';
import { StandardEditorProps } from '@grafana/data';
import { HorizontalGroup, Input, Select } from '@grafana/ui';
import { MultiSwitchTabDataType, MultiSwitchTabType, MultiSwitchType } from '../types';

export const MultiSwitchTab: React.FC<StandardEditorProps<any, any>> = props => {
  const [count, setCount] = useState(Object.keys(props?.value?.data || {}).length || 1);
  const [type, setType] = useState<MultiSwitchType>(props?.value?.type || MultiSwitchType.BUTTON);
  const [keyValues, setKeyValues] = useState<MultiSwitchTabDataType>(props?.value?.data || {});

  useEffect(() => {
    const transformedVal: MultiSwitchTabType = { type: type, data: {} };
    [...Array(count).keys()].forEach(i => {
      transformedVal.data[i] = { name: '', value: -1 };
      transformedVal.data[i].name = (keyValues[i] && keyValues[i].name) || '';
      transformedVal.data[i].value = (keyValues[i] && keyValues[i].value) || -1;
    });
    props.onChange(transformedVal);
  }, [count, type, JSON.stringify(keyValues)]);

  return (
    <>
      <Input
        type="number"
        onChange={e => {
          setCount(parseInt((e.target as HTMLTextAreaElement).value, 10));
        }}
        value={count}
        min={1}
        max={5}
      />
      <br />
      <Select
        onChange={e => {
          if (e.value === MultiSwitchType.BUTTON) {
            setType(MultiSwitchType.BUTTON);
          } else {
            setType(MultiSwitchType.DROPDOWN);
          }
        }}
        options={[
          { label: MultiSwitchType.BUTTON, value: MultiSwitchType.BUTTON },
          { label: MultiSwitchType.DROPDOWN, value: MultiSwitchType.DROPDOWN },
        ]}
        placeholder="Select Switch Type"
        value={type}
      />
      {[...Array(count).keys()].map((keyVal, i) => {
        return (
          <div style={{ margin: '8px 0 0 8px' }}>
            <HorizontalGroup>
              <Input
                onChange={e => {
                  if (!keyValues[i]) {
                    keyValues[i] = { name: '', value: '' };
                  }
                  keyValues[i].name = (e.target as HTMLTextAreaElement).value;
                  setKeyValues({ ...keyValues });
                }}
                value={(keyValues[i] && keyValues[i].name) || ''}
                placeholder="name"
              />
              <Input
                onChange={e => {
                  if (!keyValues[i]) {
                    keyValues[i] = { name: '', value: '' };
                  }
                  keyValues[i].value = (e.target as HTMLTextAreaElement).value;
                  setKeyValues({ ...keyValues });
                }}
                value={(keyValues[i] && keyValues[i].value) || ''}
                placeholder="value"
              />
            </HorizontalGroup>
          </div>
        );
      })}
    </>
  );
};
