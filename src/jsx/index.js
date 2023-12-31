import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import "./index.css";
import "./chart.css";
import "./step.css";
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";

import ScrollToTop from "./layouts/ScrollToTop";
import Home from "./components/Dashboard/Home";
import Error404 from "./pages/Error404";
import { ThemeContext } from "../context/ThemeContext";
import Escrow from "./components/Escrow";
import Landing from "../landing/Landing";



const Markup = () => {
  const allroutes = [
    { url: "home", component: <Landing /> },
    { url: "serviceReq", component: <Escrow /> },
    /// Dashboard
    { url: "", component: <Home /> },
    { url: "dashboard", component: <Home /> }
  ];


  return (
    <>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='page-error-404' element={<Error404 />} />
        <Route element={<MainLayout />} >
          {allroutes.map((data, i) => (
            <Route
              key={i}
              exact
              path={`${data.url}`}
              element={data.component}
            />
          ))}
        </Route>
      </Routes>
      <ScrollToTop />
    </>
  );
};


function MainLayout() {
  const { menuToggle } = useContext(ThemeContext);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1000)
  }, [])

  return (
    <div id="main-wrapper" className={`show ${menuToggle ? "menu-toggle" : ""}`}>
      {
        loader ? <div className="loader-wrapper">
          <div className="loader"></div>
        </div>
          : <Nav />
      }
      <div className="content-body" style={{ minHeight: window.screen.height - 45 }}>
        <div className="container-fluid">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  )

};

export default Markup;
