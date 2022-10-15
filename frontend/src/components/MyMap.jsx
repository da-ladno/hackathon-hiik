import React  from 'react'
import { YMaps, Map, GeolocationControl, Placemark ,Circle} from "@pbe/react-yandex-maps";

const MyMap = ({res, pushRefs, setMapRef, mapCenter, circleGeometry}) => {

  return (
    <YMaps query={{
      apikey: 'c970de01-d938-407e-b299-61a64e4c9c13',
    }}>
    <div className='Map'>
        <Map state={{center:mapCenter,zoom:9}} width="100%" height="400px" modules={["geolocation", "geocode"]} instanceRef={inst => {setMapRef(inst)}} >
          <GeolocationControl options={{
            float: 'left'
          }}
          />
          {res.map(office => 
            <Placemark 
             id={office.postalCode}
             key={office.postalCode}
             geometry={[office.latitude,office.longitude]}
             options={{
              iconLayout: "default#image",
              iconImageSize: [30, 42],
              iconImageHref: 'https://downloader.disk.yandex.ru/preview/5ce2d080cd371a356edc32e6c44c7116e703718b73f1c0ab6968063e1d615b2a/634a5c6a/wCspxMMkxsL6f_0ar6LfEYqhZPGle17k9vruW6spBAsbZHkK9PfbUuuDJrkjPJVbzLcp_zsT8DW2MpQxu59oAQ%3D%3D?uid=0&filename=PochtaRossiiMarkBlue.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v2&size=2048x2048'
            }}
            instanceRef={inst => {pushRefs(inst)}}
             />
          )}
          <Circle geometry={[circleGeometry, 5000]} options={{
            draggable: false,
            fillColor: '#CAE3FF',
            strokeColor: '#0064DC',
            strokeOpacity: 0.8,
            strokeWidth: 5,
            fillOpacity: 0.4
          }} />
        </Map>
    </div>
  </YMaps>
  )

}

export default MyMap