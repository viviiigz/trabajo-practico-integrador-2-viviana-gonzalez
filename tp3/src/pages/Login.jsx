import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useForm } from '../hooks/useForm';
import { Loading } from '../components/Loading';

export const Login = ({ onLogin }) => { 
  const { formValues, handleChange } = useForm({
    username: '',
    password: ''
  });

  // Estado para manejar la carga y errores
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
//validaciones 
    if (!formValues.username || !formValues.password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    try {
      // primer fetch: para guardar la cookie
      const response = await fetch("http://localhost:3000/api/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formValues)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al iniciar sesión");
      }

      // segundo fetch: pedir los datos del perfil para asegurarnos de q la cookie funcione
      const profileResponse = await fetch("http://localhost:3000/api/profile", {
        credentials: "include",
      });
      if (!profileResponse.ok) {
        throw new Error("Login exitoso, pero no se pudo obtener el perfil.");
      }
      
      const profileData = await profileResponse.json();

      onLogin(profileData.user); 

      navigate('/home');

    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false); 
    } 
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    // estilos de bootstrap
    <main className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="card shadow" style={{ width: '40rem' }}>
        <div className="card-body p-4">
          <h2 className="card-title text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formValues.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </form>
          <p className="mt-3 text-center">
            ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

