import React  from 'react'
import { YMaps, Map, GeolocationControl, Placemark, Circle, SearchControl} from "@pbe/react-yandex-maps";
import MyPlacemark from './MyPlacemark';

const MyMap = ({res, 
  pushRefs, 
  // setMapRef, 
  mapCenter, 
  circleGeometry, 
  setMarkRef, 
  markGeometry, 
  setMarkGeometry, 
  sliderValue, 
  setCircleGeometry,
  setActive,
  badGeo,
  setBadGeo,
  setModalObject
}) => {





  const mapClickHandler = (e) => {
    const coords = e.get('coords')
    setMarkGeometry(coords)
    setCircleGeometry(coords)
    setBadGeo([[0,0],[0,0]])
    setActive(false)
  }

  return (
    <YMaps query={{
      apikey: 'c970de01-d938-407e-b299-61a64e4c9c13',
    }}>
    <div className='Map'>
        <Map  state={mapCenter} 
              width="100%" 
              height="400px" 
              modules={["geolocation", "geocode"]} 
              onClick={mapClickHandler}
              >
          <GeolocationControl options={{
            float: 'left'
          }}
          />
          {res.map((office,index) => 
            <MyPlacemark key={office.postalCode} 
            res={res} 
            office={office} 
            index={index} 
            pushRefs={pushRefs} 
            setActive={setActive}
            setBadGeo={setBadGeo}
            setModalObject={setModalObject}
            />
          )}
          <Circle geometry={[circleGeometry, sliderValue*1000]} options={{
            draggable: false,
            fillColor: '#CAE3FF',
            strokeColor: '#0064DC',
            strokeOpacity: 0.8,
            strokeWidth: 5,
            fillOpacity: 0.4
          }} 
          onClick={mapClickHandler}
          />
          <SearchControl options={{
            float: 'right',
            noPlacemark:'true'
          }} />
          <Placemark geometry={markGeometry} instanceRef={inst => setMarkRef(inst)}/>
          <Placemark 
            geometry={badGeo[0]}
            options={{
            iconLayout: "default#image",
            iconImageSize: badGeo[1],
            iconImageHref: 'https://downloader.disk.yandex.ru/preview/b919c9c777b71952bf22aac68a72dc0a09f43f67abc6d165e3b78a4f574d3cca/634a5cd8/kEo5E0lZYv6lO_fMO-4tT4qhZPGle17k9vruW6spBAtpyEBxwanIj0rl9eW9y0cPf09LceQz656FiBPwcw4-tg%3D%3D?uid=0&filename=PochtaRossiiMarkRed.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v2&size=2048x2048',
            zIndex:1000 
          }}
          />
        </Map>
    </div>
  </YMaps>
  )

}

export default MyMap