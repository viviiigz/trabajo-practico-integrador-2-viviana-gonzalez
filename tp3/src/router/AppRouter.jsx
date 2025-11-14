import { Routes, Route, Navigate } from "react-router";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Tasks } from '../pages/Tasks';
// import { Profile } from '../pages/Profile';
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useState, useEffect } from "react";
import { Loading } from "../components/Loading"; // Para la carga inicial

export const AppRouter = () => {
  const [user, setUser] = useState(null);
  // Estado para saber si ya verificamos la sesión inicial
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // verificar el inicio de sesion al cargar la app
  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/profile", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error de red:", error);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkInitialAuth();
  }, []); // el array vacio hace q se ejecute una sola vez

  // si no se verifico la sesion se muestra el loading
  if (isLoadingAuth) {
    return <Loading />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* <header>
        <h1>Mi Aplicación</h1>
      </header> */}
      <Navbar user={user} onLogout={handleLogout} />

      <main className="container flex-grow-1 my-4">
        <Routes>
          {/* rutas públicas */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login onLogin={handleLogin} />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register onRegister={handleLogin} />
              </PublicRoute>
            }
          />

          {/* rutas privadas */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
          {/* <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} /> */}

          {/* redirecciones */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/*"
            element={<Navigate to={user ? "/home" : "/login"} />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};
