import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import { useAppContext } from "./contexts/AppContext";
import Detail from "./pages/Detail";
import ListUser from "./pages/ListUser";

function App() {
  const { isLoggedIn } = useAppContext();
  return (
    <Router>
      <Routes>
        
        <Route
          path="/"
          element={
            <Layout>
              <div>s</div>
            </Layout>
          }
        ></Route>

        <Route path="/login" element={<Login></Login>}></Route>

        {isLoggedIn && (
          <>
            <Route
              path="/me"
              element={
                <Layout>
                  <Detail></Detail>
                </Layout>
              }
            ></Route>

            <Route
              path="/me/danhsach"
              element={
                <Layout>
                  <ListUser></ListUser>
                </Layout>
              }
            ></Route>
            
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
