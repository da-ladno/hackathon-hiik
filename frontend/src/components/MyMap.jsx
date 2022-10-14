import React from 'react'
import { YMaps, Map, GeolocationControl } from "@pbe/react-yandex-maps";
import '../style.css'
import { useState } from 'react';

const MyMap = () => {

  const [center, setCenter] = useState([55.75, 37.57])

  return (
    <YMaps query={{
      apikey: 'c970de01-d938-407e-b299-61a64e4c9c13',
    }}>
    <div className='Map'>
        <Map state={{center:center,zoom:9}} width="100%" height="400px" modules={["geolocation", "geocode"]} >
          <GeolocationControl options={{
            float: 'left'
          }} 
          />
        </Map>
    </div>
  </YMaps>
  )

}

export default MyMap