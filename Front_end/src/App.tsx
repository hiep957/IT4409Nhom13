// import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Layout from "./layouts/Layout";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { useAppContext } from "./contexts/AppContext";
import AddHotel from "./Pages/AddHotel";
import InfoUser from "./Pages/InfoUser";
import MyHotels from "./Pages/MyHotels";
import EditHotel from "./Pages/EditHotel";
import Search from "./Pages/Search";
import Detail from "./Pages/Detail";
import Booking from "./Pages/Booking";
import MyBookings from "./Pages/MyBookings";
import Home from "./Pages/Home";

function App() {
  // const [count, setCount] = useState(0);
  const { isLoggedIn, role } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home/></Layout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />
        <Route
          path="/detail/:hotelId"
          element={
            <Layout>
              <Detail />
            </Layout>
          }
        /> 
        {isLoggedIn && role === "User"||"user" && (
          <>
            <Route
              path="/hotel/:hotelId/booking"
              element={
                <Layout>
                  <Booking />
                </Layout>
              }
            />

            <Route
              path="/setting/your-info"
              element={
                <Layout>
                  <InfoUser />
                </Layout>
              }
            />

            <Route
              path="/my-bookings"
              element={
                <Layout>
                  <MyBookings />
                </Layout>
              }
            />
          </>
        )}

        {role === "Admin" && isLoggedIn && (
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
              path="/edit-hotel/:hotelId"
              element={
                <Layout>
                  <EditHotel />
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
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
