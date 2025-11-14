import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Loading } from "../components/Loading";
// import { Navbar } from "../components/Navbar";
// import { Footer } from "../components/Footer";


export const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getUser = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/profile", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error fetch profile");
      }
      const data = await response.json();
      setUser(data.user); 
    } catch (error) {
      console.log(error);
      navigate("/login");
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    // 
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/logout", {
        method: "POST", 
        credentials: "include",
      });
      if (response.ok) {
        navigate("/login"); 
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (isLoading || !user) {
    return <Loading />;
  }

  return (
    <>
      <main className="container my-5">
        <h1 className="display-5">Perfil de Usuario</h1>
        <div className="card mt-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Información del Usuario</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>Nombre:</strong> {user.name} 
              </li>
              <li className="list-group-item">
                <strong>Apellido:</strong> {user.lastname} 
              </li>
            </ul>
            <button className="btn btn-danger mt-3" onClick={handleLogout} disabled={isLoading}>
              Cerrar Sesión
            </button> 
          </div>
        </div>
      </main>
    </>
  );
};
