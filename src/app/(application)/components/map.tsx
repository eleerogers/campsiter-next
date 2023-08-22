import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';


const containerStyle = {
  width: '100%',
  height: '400px'
};

interface Props {
  lat: number;
  lng: number;
}

function MapContainer({ lat, lng }: Props) {
  const center = { lat, lng };
  const REACT_APP_GOOGLE_API_KEY: string = process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY as string

  return (
    <LoadScript googleMapsApiKey={REACT_APP_GOOGLE_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      />
    </LoadScript>
  );
}

export default React.memo(MapContainer);
