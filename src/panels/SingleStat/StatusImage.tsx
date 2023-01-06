import { Icons } from 'assets/icons';
import { Image } from 'types';
import * as React from 'react';
import { useEffect, useState } from 'react';

const images: any = {
  AlertOff: Icons.ALERT_OFF,
  AlertOn: Icons.ALERT_ON,
  CoolingOff: Icons.COOL_OFF,
  CoolingOn: Icons.COOL_ON,
  FanOff: Icons.FAN_OFF,
  FanOn: Icons.FAN_ON,
  HeatingOff: Icons.HEAT_OFF,
  HeatingOn: Icons.HEAT_ON,
  LightOff: Icons.LIGHT_OFF,
  LightOn: Icons.LIGHT_ON,
};

export default function StatusImage({ image, state }: { image: string; state: boolean }) {
  const [displayImage, setDisplayImage] = useState('');
  useEffect(() => {
    if (image !== Image.NoImage) {
      if (state) {
        setDisplayImage(`${image}On`);
      } else {
        setDisplayImage(`${image}Off`);
      }
    }
  }, [image, state]);

  return (
    <>
      {image !== Image.NoImage && (
        <img
          src={images[displayImage]?.uri}
          alt={displayImage}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        />
      )}
    </>
  );
}
