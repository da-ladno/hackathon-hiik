import React from 'react'
import { Placemark } from "@pbe/react-yandex-maps";
import getOfficeInfo from '../api/getOfficeInfo';

const MyPlacemark = ({office, setActive, res, pushRefs, index, setBadGeo, setModalObject}) => {

    const placemarkHandler = () => {
        setBadGeo([[office.latitude,office.longitude],[30,42]])
        getOfficeInfo(setModalObject,res[index].postalCode, Math.floor(Date.now() / 1000),setActive)
      }

  return (
    <Placemark 
    geometry={[office.latitude,office.longitude]}
    options={{
     iconLayout: "default#image",
     iconImageSize: [30, 42],
     iconImageHref:'https://downloader.disk.yandex.ru/preview/5ce2d080cd371a356edc32e6c44c7116e703718b73f1c0ab6968063e1d615b2a/634a5c6a/wCspxMMkxsL6f_0ar6LfEYqhZPGle17k9vruW6spBAsbZHkK9PfbUuuDJrkjPJVbzLcp_zsT8DW2MpQxu59oAQ%3D%3D?uid=0&filename=PochtaRossiiMarkBlue.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v2&size=2048x2048'
   }}
   onClick={placemarkHandler}
   instanceRef={inst => {pushRefs(inst)}}
    />
  )
}

export default MyPlacemark