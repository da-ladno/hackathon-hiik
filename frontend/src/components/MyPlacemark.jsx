import React from 'react'
import { Placemark } from "@pbe/react-yandex-maps";
import getOfficeInfo from '../api/getOfficeInfo';

const MyPlacemark = React.memo(({office, setActive, setRefs, setBadGeo, setModalObject}) => {

    const placemarkHandler = () => {
        setBadGeo([[office.latitude,office.longitude],[30,42]])
        getOfficeInfo(setModalObject,office.postalCode, Math.floor(Date.now() / 1000),setActive)
      }

  return (
    <Placemark 
    geometry={[office.latitude,office.longitude]}
    options={{
     iconLayout: "default#image",
     iconImageSize: [30, 42],
     iconImageHref:'PochtaRossiiMarkBlue.png'
   }}
   onClick={placemarkHandler}
   instanceRef={inst => {setRefs((refs) => [...refs,inst])}}
    />
  )
})

export default MyPlacemark