import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Loading } from "../components/Loading";
import { useForm } from "../hooks/useForm";

export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { formValues, handleChange, handleReset } = useForm({
    title: '',
    description: '',
    is_completed: false
  });

  // cargar tareas al iniciar la pagina
  useEffect(() => {
    const getPageData = async () => {
      try {
        await fetchTasks();
      } catch (error) {
        console.log(error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    getPageData();
  }, [navigate]);

  // funcion para cargar tareas
  const fetchTasks = async () => {
    try {
      const tasksResponse = await fetch("http://localhost:3000/api/tasks-by-user", {
        credentials: "include",
      });
      if (!tasksResponse.ok) throw new Error("Error al cargar tareas");
      const tasksData = await tasksResponse.json();
      setTasks(tasksData);
    } catch (error) {
      setError(error.message);
    }
  };

  // crear nueva tarea
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formValues.title || !formValues.description) {
      setError("Título y descripción son obligatorios.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/tasks", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formValues)
      });

      if (!response.ok) throw new Error("Error al crear la tarea");

      await fetchTasks();
      handleReset();
      
    } catch (error) {
      setError(error.message);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="container my-5">
      <div className="row">

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Crear Tarea</h3>
              <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Título</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="form-control"
                    value={formValues.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Descripción</label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    rows="3"
                    value={formValues.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Guardar Tarea
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <h2>Mis Tareas</h2>
          {tasks.length === 0 ? (
            <p>No tienes tareas pendientes.</p>
          ) : (
            <div className="list-group">
              {tasks.map(task => (
                <div key={task.id} className="list-group-item mb-2">
                  <h5>{task.title}</h5>
                  <p>{task.description}</p>
                  <small>Estado: {task.is_completed ? 'Completada' : 'Pendiente'}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};