import MyMap from "./components/MyMap"
import Footer from "./components/Footer"
import './style.css'
import './normalize.css'
import Header from "./components/Header";
import Loader from "./components/Loader";
import { useState, useMemo } from "react";
import Slider from "./components/Slider";
import Modal from "./components/Modal";
import getOfficeInfo from "./api/getOfficeInfo";

function App() {
  const [mapCenter,setMapCenter] = useState([55.75, 37.57])
  const [circleGeometry,setCircleGeometry] = useState([55.75, 37.57])
  const [markGeometry,setMarkGeometry] = useState([55.75, 37.57])
  const [res,setRes] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [sliderValue, setInputValue] = useState(5)
  const [active,setActive] = useState(false)
  const [badGeo, setBadGeo] = useState([[0,0],[0,0]])
  const [modalObject, setModalObject] = useState({})

  const mapState = useMemo(
    () => ({ center: mapCenter, zoom:9 }),
    [mapCenter]
  );

  let markRef;
  let mapRef;

  const refs = []
  const pushRefs = (inst) => {
    refs.push(inst)
  }

  const setMapRef = (inst) => {
    mapRef = inst
  }

  const setMarkRef = (inst) => {
    markRef = inst
  }

  const handleClick = (index,office) => {
    setMapCenter([office.latitude,office.longitude])
    setBadGeo([[office.latitude,office.longitude],[30,42]])
    getOfficeInfo(setModalObject,res[index].postalCode, Math.floor(Date.now() / 1000),setActive)
  }
  
  const handleButtonClick = async (markRef, refs) => {
    setRes([])
    const [latitude, longitude] = markRef.geometry.getCoordinates();
    fetch(`http://92.37.244.143:8000/get_offices?latitude=${latitude}&longitude=${longitude}&radius=${sliderValue}`)
      .then((response) => response.json())
      .then((data) => {setRes(data.postOffices); setMapCenter([latitude,longitude])})
  }

  return (
    <div>
        <Header />
        <MyMap res={res} 
        setMapRef={setMapRef} 
        mapCenter={mapState} 
        circleGeometry={circleGeometry} 
        setMarkRef={setMarkRef} 
        markRef={markRef} 
        markGeometry={markGeometry} 
        setMarkGeometry={setMarkGeometry} 
        sliderValue={sliderValue} 
        setCircleGeometry={setCircleGeometry}
        setActive={setActive}
        pushRefs={pushRefs}
        refs={refs}
        badGeo={badGeo}
        setBadGeo={setBadGeo}
        setModalObject={setModalObject}
        />
        <div className={'findPanel'}>
          <button onClick={() => { handleButtonClick(markRef) }}>Найти</button>
          <Slider sliderValue={sliderValue} setInputValue={setInputValue}/>
        </div>
        <ul>
          {res.map((office,index) => 
            <li key={office.postalCode} onClick={() => {handleClick(index,office)}}>{office.address.fullAddress}</li>
          )}
        </ul>
        <Footer />
        <Modal active={active} setActive={setActive} setBadGeo={setBadGeo} modalObject={modalObject}/>
    </div>
  );
}

export default App;
