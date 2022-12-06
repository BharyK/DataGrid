import { Box } from "@mui/material";
import "./App.css";
import { Loading } from "./components/Loading";
import { LandingPage } from "./containers/LandingPage/LandingPage";
import { SignIn } from "./containers/LogIn/Login";
import { dataGridStore } from "./store/DataGrid.store";

function App() {
  const { isLoading } = dataGridStore((state) => state);
  return (
    <Box>
      {isLoading === false && <Loading />}
      <LandingPage />
    </Box>
  );
}

export default App;
