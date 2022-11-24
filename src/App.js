import "./App.css";
import { Loading } from "./components/Loading";
import { LandingPage } from "./containers/DataGrid/LandingPage/LandingPage";
import { dataGridStore } from "./store/DataGrid.store";

function App() {
  const { isLoading } = dataGridStore((state) => state);
  return (
    <div className="App">
      {isLoading === false && <Loading />}
      <LandingPage />
    </div>
  );
}

export default App;
