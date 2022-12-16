import { Box } from "@mui/material";
import { Loading } from "./components/Loading";
import { LandingPage } from "./containers/LandingPage";
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
