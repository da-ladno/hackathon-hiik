import React  from 'react'
import { YMaps, Map, GeolocationControl, Placemark, Circle, SearchControl} from "@pbe/react-yandex-maps";
import MyPlacemark from './MyPlacemark';

const MyMap = ({res, 
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
          {res.map((office) => 
            <MyPlacemark key={office.postalCode} 
            office={office} 
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
            iconImageHref: 'PochtaRossiiMarkRed.png',
            zIndex:1000 
          }}
          />
        </Map>
    </div>
  </YMaps>
  )

}

export default MyMap