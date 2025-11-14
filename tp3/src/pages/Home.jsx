import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { Loading } from "../components/Loading";

export const Home = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getPageData = async () => {
    try {
      // Obtener perfil del usuario
      const profileResponse = await fetch("http://localhost:3000/api/profile", {
        credentials: "include",
      });
      if (!profileResponse.ok) throw new Error("Error al cargar perfil");
      const profileData = await profileResponse.json();
      setUser(profileData.user);

      // Obtener tareas del usuario
      const tasksResponse = await fetch("http://localhost:3000/api/tasks-by-user", {
        credentials: "include",
      });
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
      }

    } catch (error) {
      console.log(error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPageData();
  }, []);

  // para cumplir con la visualización de estadísticas 
  const totalTasks = tasks.length; // cantidad total de tareas
  const completedTasks = tasks.filter(task => task.is_completed).length; // cantidad de tareas completadas
  const pendingTasks = totalTasks - completedTasks; // cantidad de tareas pendientes, se calcula restando las completadas de las totales

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="container my-8">
      {user && (
        <div className="text-center mb-5">
          <h1 className="display-4">Bienvenido, {user.username}!</h1>
          <p className="lead">Este es tu panel de control de tareas</p>
        </div>
      )}

      {/* resumen para las tareas*/}
      <div className="row mb-5">
        <div className="col-md-4">
          <div className="card text-white bg-primary">
            <div className="card-body text-center">
              <h3>{totalTasks}</h3>
              <p>Total de Tareas</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success">
            <div className="card-body text-center">
              <h3>{completedTasks}</h3>
              <p>Completadas</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning">
            <div className="card-body text-center">
              <h3>{pendingTasks}</h3>
              <p>Pendientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tareas recientes */}
      {tasks.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h4 className="mb-0">Tareas Recientes</h4>
          </div>
          <div className="card-body">
            <div className="list-group">
              {tasks.slice(0, 3).map(task => ( // mostrar solo las 3 primeras tareas
                <div key={task.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className={`mb-1 ${task.is_completed ? 'text-decoration-line-through text-muted' : ''}`}>
                        {task.title}
                      </h6>
                      <p className="mb-1 text-muted small">{task.description}</p>
                    </div>
                    <span className={`badge ${task.is_completed ? 'bg-success' : 'bg-warning'}`}>
                      {task.is_completed ? 'Completada' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* si la cantidad de tareas es mayor a 3 mostrar un mensaje */}
            {tasks.length > 3 && (
              <div className="text-center mt-3">
                <small className="text-muted">
                  y {tasks.length - 3} tareas más...
                </small>
              </div>
            )}
          </div>
        </div>
      )}

      {/* boton para ir a la pagina de tareas */}
      <div className="text-center mt-4">
        <Link to="/tasks" className="btn btn-primary btn-lg">
          Gestionar todas las tareas
        </Link>
      </div>
    </main>
  );
};