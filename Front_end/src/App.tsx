import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Layout from "./layouts/Layout";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { useAppContext } from "./contexts/AppContext";
import AddHotel from "./Pages/AddHotel";
import MyHotels from "./Pages/MyHotels";
import EditHotel from "./Pages/EditHotel";
function App() {
  const [count, setCount] = useState(0);
  const { isLoggedIn } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout children={undefined}></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {isLoggedIn && (
          <>
            <Route
              path="/add-hotel"
              element={
                <Layout>
                  <AddHotel />
                </Layout>
              }
            />
            <Route
              path="/my-hotels"
              element={
                <Layout>
                  <MyHotels />
                </Layout>
              }
            />
            <Route
              path="/edit-hotel/:hotelId"
              element={
                <Layout>
                  <EditHotel />
                </Layout>
              }
            />
          </>
          
        )}
      </Routes>
    </Router>
  );
}

export default App;
