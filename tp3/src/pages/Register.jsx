import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useForm } from '../hooks/useForm' 
import { Loading } from '../components/Loading'
// import { Navbar } from '../components/Navbar'
// import { Footer } from '../components/Footer'


export const Register = ({ onRegister }) => { 
  const { formValues, handleChange } = useForm({
    name: '',
    lastname: '', //no se si poner o no el dni pq el server no tiene 
    username: '',
    email: '',
    password: ''
  });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // primer fetch: registrar el usuario
      const response = await fetch("http://localhost:3000/api/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formValues)
      });

 //se hace de esta forma pq no se pudo arreglar el bug del backend que tira 500 aun cuando el usuario se crea bien
      if (!response.ok) {
        
        // si el error es 500 se ignora y se continua
        if (response.status === 500) {
          //el warn es solo para q aparezca en consola del navegador 
          console.warn("Se recibió un error 500 de /api/register. Asumiendo registro exitoso y continuando con reegistro automático");
          //no se hace nada y se continua
        } else {
          //si es otro error distinto de 500, se maneja normalmente
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al registrarse");
        }
      }
      
      // segundo fetch: loguear al usuario automáticamente
      const loginResponse = await fetch("http://localhost:3000/api/login", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
              username: formValues.username,
              password: formValues.password
          })
      });

      // tercer fetch: pedir los datos del perfil para AppRouter
      const profileResponse = await fetch("http://localhost:3000/api/profile", {
        credentials: "include",
      });
      if (!profileResponse.ok) {
        throw new Error("Login exitoso, pero no se pudo obtener el perfil.");
      }
      
      const profileData = await profileResponse.json();

      // llamar al onRegister con los datos del perfil
      onRegister(profileData.user); 

      // dirijomos al home pq es requisito de la actividad
      navigate('/home');

    } catch (error) {
      setError(error.message);
      setLoading(false); 
    } 
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    //estilos de bootstrap para centrar el card en la pantalla
    <main className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="card shadow" style={{ width: '40rem' }}>
        <div className="card-body p-4">
          <h2 className="card-title text-center">Registro</h2>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Nombre</label>
              <input type="text" className="form-control" id="name" name="name" value={formValues.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="lastname" className="form-label">Apellido</label>
              <input type="text" className="form-control" id="lastname" name="lastname" value={formValues.lastname} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form-control" id="username" name="username" value={formValues.username} onChange={handleChange} required />
            </div>
              <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" name="email" value={formValues.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" name="password" value={formValues.password} onChange={handleChange} required />
            </div>
            
            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Crear Cuenta'} 
              {/* no se muestra bien el loading */} 

            </button>
          </form>
          <p className="mt-3 text-center">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

