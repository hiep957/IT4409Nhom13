import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Layout from "./layouts/Layout";
import Login from "./components/Login";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
       <Route path="/login" element={<Layout><Login/></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
