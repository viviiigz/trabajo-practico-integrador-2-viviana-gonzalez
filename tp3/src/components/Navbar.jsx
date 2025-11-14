import { NavLink, useNavigate } from 'react-router'

export const Navbar = ({ user, onLogout }) => { // recibe user y onLogout como props
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        if (onLogout) {
          onLogout(); // llama a la función onLogout pasada desde el padre
        }
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
<nav className="navbar navbar-expand-lg navbar-dark mb-4" 
      style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
  <div className="container-fluid">
    
    <NavLink className="navbar-brand fw-bold" to={user ? "/home" : "/login"}>
      Task App
    </NavLink>

    {user && (
      <>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* enlaces solo para los que estan logueados  */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  isActive ? "nav-link active fw-bold" : "nav-link"
                } 
                to="/home"
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  isActive ? "nav-link active fw-bold" : "nav-link"
                } 
                to="/tasks"
              >
                Tasks
              </NavLink>
            </li>
            
            <li className="nav-item dropdown">
              <button 
                className="btn btn-link nav-link dropdown-toggle text-white d-flex align-items-center" 
                type="button" 
                data-bs-toggle="dropdown"
                style={{ textDecoration: 'none' }}
              >
                <i className="bi bi-person-fill me-2"></i>
              </button>
              
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <NavLink 
                    className={({ isActive }) => 
                      `dropdown-item ${isActive ? "active" : ""}`
                    } 
                    to="/profile"
                  >
                    <i className="bi bi-person me-2"></i>
                    Perfil
                  </NavLink>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button 
                    className="dropdown-item text-danger" 
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </li>
          </ul>

            </div>
          </>

        )}
        
      </div>
    </nav>
  );
};
