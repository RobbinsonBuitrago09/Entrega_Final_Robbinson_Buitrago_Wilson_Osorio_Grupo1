import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";


import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import Dashboard from "./Pages/Dashboard/Dashboard";
import CreateNews from "./Pages/Dashboard/CreateNews/CreateNews";
import EditNews from "./Pages/Dashboard/EditNews/EditNews";
import NewsDetail from "./Pages/NewsDetail/NewsDetail";

import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/noticia/:id" element={<NewsDetail />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute rolesAllowed={["reportero", "editor"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/crear"
              element={
                <ProtectedRoute rolesAllowed={["reportero"]}>
                  <CreateNews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/editar/:id"
              element={
                <ProtectedRoute rolesAllowed={["reportero", "editor"]}>
                  <EditNews />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
