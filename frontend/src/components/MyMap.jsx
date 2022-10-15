import React  from 'react'
import { YMaps, Map, GeolocationControl, Placemark, Circle, SearchControl} from "@pbe/react-yandex-maps";

const MyMap = ({res, pushRefs, setMapRef, mapCenter, circleGeometry ,refs, setMarkRef, markGeometry, setMarkGeometry}) => {

  const placemarkHandler = (refs,index) => {
    refs.forEach(ref => {
      ref.options.set('iconImageHref', 'https://downloader.disk.yandex.ru/preview/5ce2d080cd371a356edc32e6c44c7116e703718b73f1c0ab6968063e1d615b2a/634a5c6a/wCspxMMkxsL6f_0ar6LfEYqhZPGle17k9vruW6spBAsbZHkK9PfbUuuDJrkjPJVbzLcp_zsT8DW2MpQxu59oAQ%3D%3D?uid=0&filename=PochtaRossiiMarkBlue.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v2&size=2048x2048')
    });
    refs[index].options.set('iconImageHref', 'https://downloader.disk.yandex.ru/preview/b919c9c777b71952bf22aac68a72dc0a09f43f67abc6d165e3b78a4f574d3cca/634a5cd8/kEo5E0lZYv6lO_fMO-4tT4qhZPGle17k9vruW6spBAtpyEBxwanIj0rl9eW9y0cPf09LceQz656FiBPwcw4-tg%3D%3D?uid=0&filename=PochtaRossiiMarkRed.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v2&size=2048x2048')
  }

  const mapClickHandler = (e) => {
    const coords = e.get('coords')
    setMarkGeometry(coords)
  }

  return (
    <YMaps query={{
      apikey: 'c970de01-d938-407e-b299-61a64e4c9c13',
    }}>
    <div className='Map'>
        <Map state={{center:mapCenter,zoom:9}} 
              width="100%" 
              height="400px" 
              modules={["geolocation", "geocode"]} 
              instanceRef={inst => {setMapRef(inst)}} 
              onClick={mapClickHandler}
              >
          <GeolocationControl options={{
            float: 'left'
          }}
          />
          {res.map((office,index) => 
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
            onClick={() => {placemarkHandler(refs,index)}}
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
          <SearchControl options={{
            float: 'right',
            noPlacemark:'true'
          }} />
          <Placemark geometry={markGeometry} instanceRef={inst => setMarkRef(inst)}/>
        </Map>
    </div>
  </YMaps>
  )

}

export default MyMap