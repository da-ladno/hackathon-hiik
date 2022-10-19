import MyMap from "./components/MyMap"
import Footer from "./components/Footer"
import './style.css'
import './normalize.css'
import Header from "./components/Header";
import { useState, useMemo } from "react";
import Slider from "./components/Slider";
import Modal from "./components/Modal";
import getOfficeInfo from "./api/getOfficeInfo";

function App() {
  const [mapCenter,setMapCenter] = useState([55.75, 37.57])
  const [circleGeometry,setCircleGeometry] = useState([55.75, 37.57])
  const [markGeometry,setMarkGeometry] = useState([55.75, 37.57])
  const [res,setRes] = useState([]);
  const [sliderValue, setInputValue] = useState(5)
  const [active,setActive] = useState(false)
  const [badGeo, setBadGeo] = useState([[0,0],[0,0]])
  const [modalObject, setModalObject] = useState({})

  const mapState = useMemo(
    () => ({ center: mapCenter, zoom:9 }),
    [mapCenter]
  );

  const handleClick = (index,office) => {
    setMapCenter([office.latitude,office.longitude])
    setBadGeo([[office.latitude,office.longitude],[30,42]])
    getOfficeInfo(setModalObject,res[index].postalCode, Math.floor(Date.now() / 1000),setActive)
  }
  
  const handleButtonClick = () => {
    setRes([])
    setBadGeo([[0,0],[0,0]])
    setActive(false)
    const [latitude, longitude] = markGeometry;
    fetch(`http://176.126.103.192:8000/get_offices?latitude=${latitude}&longitude=${longitude}&radius=${sliderValue}&return_closed=true`)
      .then((response) => response.json())
      .then((data) => {setRes(data.postOffices); setMapCenter([latitude,longitude])})
  }

  return (
    <div className="wrap">
      <Header />
      <div className="main">
        <div className="main">
        <MyMap res={res} 
        mapCenter={mapState} 
        circleGeometry={circleGeometry} 
        markGeometry={markGeometry} 
        setMarkGeometry={setMarkGeometry} 
        sliderValue={sliderValue} 
        setCircleGeometry={setCircleGeometry}
        setActive={setActive}
        badGeo={badGeo}
        setBadGeo={setBadGeo}
        setModalObject={setModalObject}
        />
        <div className={'findPanel'}>
          <div style={{display:'flex', flexWrap:'nowrap', height:'40px', alignItems:'center'}}>
            <button onClick={handleButtonClick}>Найти</button>
            <div className={'sliderText'}>в радиусе:</div>
          </div>
          <div style={{display:'flex', flexWrap:'nowrap'}}>
            <Slider sliderValue={sliderValue} setInputValue={setInputValue}/>
            <div className={'sliderText'} style={{alignSelf:'center'}}>км</div>
          </div>

        </div>
            <ol className="tableList">
                {res.map((office, index) =>
                    <li key={office.postalCode} onClick={() => {handleClick(index,office)}}>{office.address.fullAddress === '' ? 'Адрес неизвестен' : office.address.fullAddress}</li>
                )}
            </ol>
        </div>
      </div>
      <Footer />
      <Modal active={active} setActive={setActive} setBadGeo={setBadGeo} modalObject={modalObject}/>
    </div>
  );
}

export default App;
