import React  from 'react'
import { YMaps, Map, GeolocationControl, Placemark } from "@pbe/react-yandex-maps";

const MyMap = ({res, pushRefs, setMapRef, mapCenter}) => {

  

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
              iconImageSize: [30, 30],
              iconImageHref: 'https://downloader.disk.yandex.ru/preview/fd086279742c21ccdc0fd4b25aea361ef40759faab58cd1a97371fe3f8d426f9/6349b4ba/t4IeJvhNW9kcJWI5-EScOY2KNdfqEl2-0xT1pUJcPJp78I11pK0hwwPprLxEnQx23qglofmE1OR9PLpdcaXIYw%3D%3D?uid=0&filename=37_picture_ba348328.jpg&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v2&size=1053x830'
            }}
            instanceRef={inst => {pushRefs(inst)}}
             />
          )}
        </Map>
    </div>
  </YMaps>
  )

}

export default MyMap