import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Receptionist from "./pages/Receptionist";
import PatientView from "./pages/PatientView";

function App() {
  return (
    <BrowserRouter>

      <Header />

      <Routes>
        <Route
          path="/"
          element={<Receptionist />}
        />

        <Route
          path="/patient"
          element={<PatientView />}
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;