import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Layout from './layouts/Layout';
import Login from "./pages/SignIn";
import Register  from "./pages/Register";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/login" element={<Layout><Login/></Layout>} />
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </Router>
  );
}

export default App;
