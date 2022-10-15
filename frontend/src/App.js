import MyMap from "./components/MyMap"
import Footer from "./components/Footer"
import './style.css'
import './normalize.css'
import Header from "./components/Header";
import response from "./static/json/response";
import Loader from "./components/Loader";
import { useState } from "react";

function App() {

  const [mapCenter,setMapCenter] = useState([55.75, 37.57])
  const [circleGeometry,setCircleGeometry] = useState([0, 0])
  const [res,setRes] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const refs = [];
  let mapRef;

  const pushRefs = (inst) => {
    refs.push(inst)
  }

  const setMapRef = (inst) => {
    mapRef = inst
  }

  const handleClick = (refs,index,office) => {
    refs.forEach(ref => {
      ref.options.set('iconImageSize', [30, 30])
    });
    refs[index].options.set('iconImageSize', [48, 48])
    mapRef.setCenter([office.latitude,office.longitude])
  }
  
  const handleButtonClick = async (mapRef) => {
    const [latitude, longitude] = mapRef.getCenter();
    fetch(`http://92.37.244.143:8000/get_offices?latitude=${latitude}&longitude=${longitude}&radius=5`)
      .then((response) => response.json())
      .then((data) => {setRes(data.postOffices); setMapCenter([latitude,longitude]); setCircleGeometry([latitude,longitude]) })
  }

  return (
    <div>
        <Header />
        <MyMap res={res} pushRefs={pushRefs} setMapRef={setMapRef} mapCenter={mapCenter} circleGeometry={circleGeometry}/>
        <button onClick={() => {handleButtonClick(mapRef)}}>Найти</button>
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
