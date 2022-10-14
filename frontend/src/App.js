import { YMaps, Map } from "@pbe/react-yandex-maps";

function App() {
  return (
    <YMaps>
      <div>
          My awesome application with maps!
          <Map defaultState={{ center: [55.75, 37.57], zoom: 9 }} height="500px" width="500px" />
      </div>
    </YMaps>
  );
}

export default App;
