import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Hero from "./components/Hero/Hero";
import OurStory from "./components/OurStory/OurStory";
import AboutUs from "./components/AboutUs/AboutUs";
import Donation from "./components/Donate/Donate";
import Events from "./components/EventsList/Events";
import ContributeFood from "./components/ContributeFood/ContributeFood";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import AdminLogin from "./components/AdminLogin/AdminLogin"
import RequireAuth from "./Auth/RequireAuth"
import AdminEvents from "./components/AdminEvents/AdminEvents"
import LogisticsMap from "./components/LogisticsMap/LogisticsMap"


function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <OurStory />
              <AboutUs />
              <Footer />
            </>
          }
        />
        <Route
          path="/donation"
          element={
            <>
              <Navbar />
              <Donation />
              <Footer />
            </>
          }
        />
         <Route
          path="/events"
          element={
            <>
              <Navbar />
              <Events />
              <Footer />
            </>
          }
        />
        <Route
          path="/contribute_food"
          element={
            <>
              <Navbar />
              <ContributeFood/>
              <Footer />
            </>
          }
        />
        <Route
        path="/admin"
        element={
          <>
            <Navbar />
            <AdminLogin />
            <Footer />
          </>
        }
        />
        <Route
          path="/admin/events"
          element={
            <>
              <Navbar />
              <RequireAuth>
                <AdminEvents />
              </RequireAuth>
              <Footer />
            </>
          }
        />
        <Route
          path="/admin/logistics-map"
          element={
            <>
              <Navbar />
              <RequireAuth>
                <LogisticsMap />
              </RequireAuth>
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
