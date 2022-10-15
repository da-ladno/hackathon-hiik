import MyMap from "./components/MyMap"
import Footer from "./components/Footer"
import './style.css'
import './normalize.css'
import Header from "./components/Header";
import Loader from "./components/Loader";
import { useState } from "react";
import Slider from "./components/Slider";

function App() {
  const [mapCenter,setMapCenter] = useState([55.75, 37.57])
  const [circleGeometry,setCircleGeometry] = useState([0, 0])
  const [markGeometry,setMarkGeometry] = useState([0, 0])
  const [res,setRes] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const refs = [];
  let mapRef;
  let markRef;
  const pushRefs = (inst) => {
    refs.push(inst)
  }

  const setMapRef = (inst) => {
    mapRef = inst
  }

  const setMarkRef = (inst) => {
    markRef = inst
  }

  const handleClick = async(refs,index,office) => {
    refs.forEach(ref => {
      ref.options.set('iconImageHref', 'https://downloader.disk.yandex.ru/preview/5ce2d080cd371a356edc32e6c44c7116e703718b73f1c0ab6968063e1d615b2a/634a5c6a/wCspxMMkxsL6f_0ar6LfEYqhZPGle17k9vruW6spBAsbZHkK9PfbUuuDJrkjPJVbzLcp_zsT8DW2MpQxu59oAQ%3D%3D?uid=0&filename=PochtaRossiiMarkBlue.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v2&size=2048x2048')
    });
    refs[index].options.set('iconImageHref', 'https://downloader.disk.yandex.ru/preview/b919c9c777b71952bf22aac68a72dc0a09f43f67abc6d165e3b78a4f574d3cca/634a5cd8/kEo5E0lZYv6lO_fMO-4tT4qhZPGle17k9vruW6spBAtpyEBxwanIj0rl9eW9y0cPf09LceQz656FiBPwcw4-tg%3D%3D?uid=0&filename=PochtaRossiiMarkRed.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v2&size=2048x2048')
    await mapRef.setCenter([office.latitude,office.longitude])
    await mapRef.setZoom(15); 
  }
  
  const handleButtonClick = async (markRef) => {
    setRes([])
    const [latitude, longitude] = markRef.geometry.getCoordinates();
    fetch(`http://92.37.244.143:8000/get_offices?latitude=${latitude}&longitude=${longitude}&radius=5`)
      .then((response) => response.json())
      .then((data) => {setRes(data.postOffices); setMapCenter([latitude,longitude]); setCircleGeometry([latitude,longitude])})
  }

  return (
    <div>
        <Header />
        <MyMap res={res} pushRefs={pushRefs} setMapRef={setMapRef} mapCenter={mapCenter} circleGeometry={circleGeometry}/>
        <div className={'findPanel'}>
          <button onClick={() => { handleButtonClick(mapRef) }}>Найти</button>
          <Slider />
        </div>
        <ul>
          {res.map((office,index) => 
            <li key={office.postalCode} onClick={() => {handleClick(refs,index,office)}}>{office.address.fullAddress}</li>
          )}
        </ul>
        <Footer />
    </div>
  );
}

export default App;
