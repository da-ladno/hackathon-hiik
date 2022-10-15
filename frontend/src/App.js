import MyMap from "./components/MyMap"
import Footer from "./components/Footer"
import './style.css'
import './normalize.css'
import Header from "./components/Header";
import response from "./static/json/response";

function App() {

  const res = response.postOffices
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

  return (
    <div>
        <Header />
        <MyMap res={res} pushRefs={pushRefs} setMapRef={setMapRef}/>
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
