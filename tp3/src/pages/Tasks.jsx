import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Loading } from "../components/Loading";
import { useForm } from "../hooks/useForm";

export const Tasks = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isLoadingForm, setLoadingForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loadingOperations, setLoadingOperations] = useState({});
  const navigate = useNavigate();

  const { formValues, handleChange, handleReset, setForm } = useForm({
    title: "",
    description: "",
    is_completed: false,
  });

   // para que se vea el loading al menos 1 seg
    const minLoadingTime = setTimeout(() => {
      setLoading(false);
    }, 3000);
  
  useEffect(() => {
    const getPageData = async () => {
      setLoading(true);
      try {
        const profileResponse = await fetch(
          "http://localhost:3000/api/profile",
          {
            credentials: "include",
          }
        );
        if (!profileResponse.ok) throw new Error("Not authenticated");
        const profileData = await profileResponse.json();
        setUser(profileData.user);

        await fetchTasks();
      } catch (error) {
        console.log(error);
        navigate("/login");
      } finally {
            clearTimeout(minLoadingTime);
        setTimeout(() => setLoading(false), 1000);
      }
    };
    getPageData();
  }, [navigate]);

  // funcion para obtener las tareas
  const fetchTasks = async () => {
    try {
      const tasksResponse = await fetch(
        "http://localhost:3000/api/tasks-by-user",
        {
          credentials: "include",
        }
      );
      if (!tasksResponse.ok) throw new Error("Error fetch tasks");
      const tasksData = await tasksResponse.json();
      setTasks(tasksData);
    } catch (error) {
      setError(error.message);
    }
  };
  // limpiar mensajes de error y exito
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoadingForm(true);
 
    //validaciones 
    if (!formValues.title || !formValues.description) {
      setError("Título y descripción son obligatorios.");
      setLoadingForm(false);
      return;
    }

    //aca se decide si es edicion o creacion de tarea
    const url = editingId
      ? `http://localhost:3000/api/tasks/${editingId}`
      : "http://localhost:3000/api/tasks";

    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.message ||
            `Error ${editingId ? "editando" : "creando"} la tarea` 
        );
      }

      await fetchTasks();
      handleResetForm();
      setSuccess(`Tarea ${editingId ? "actualizada" : "creada"} con éxito.`);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoadingForm(false);
      clearTimeout(minLoadingTime);
      setTimeout(() => setLoading(false), 1000);
    }
  };

  // eliminar Tarea
  const handleDelete = async (taskId) => {
    clearMessages();
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      return;
    }

    setLoadingOperations((prev) => ({ ...prev, [taskId]: true }));

    try {
      const response = await fetch(
        `http://localhost:3000/api/tasks/${taskId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la tarea");
      }

      await fetchTasks();
      setSuccess("Tarea eliminada correctamente.");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoadingOperations((prev) => ({ ...prev, [taskId]: false }));
          clearTimeout(minLoadingTime);
        setTimeout(() => setLoading(false), 1000);
    }
  };

  // marcar tarea como completada o pendiente
  const handleToggleComplete = async (task) => {
    clearMessages();
    setLoadingOperations((prev) => ({ ...prev, [task.id]: true }));


    try {
      const response = await fetch(
        `http://localhost:3000/api/tasks/${task.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title: task.title,
            description: task.description,
            is_completed: !task.is_completed,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar la tarea");
      }

      await fetchTasks();
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoadingOperations((prev) => ({ ...prev, [task.id]: false }));   
      clearTimeout(minLoadingTime);
      setTimeout(() => setLoading(false), 1000);

    }
  };

  // preparar formulario para edición
  const handleEdit = (task) => {
    clearMessages();
    setForm({
      title: task.title,
      description: task.description,
      is_completed: task.is_completed,
    });
    setEditingId(task.id);
    window.scrollTo(0, 0);
  };

  // limpiar formulario y modo edición
  const handleResetForm = () => {
    handleReset();
    setEditingId(null);
    clearMessages();
  };

  // obtener primeras 3 tareas para vista previa
  const recentTasks = tasks.slice(0, 3);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <main className="container my-8">
        <div className="row">
          <div className="col-md-4">
            <div className="card shadow-sm sticky-top" style={{ top: "20px" }}>
              <div className="card-body">
                <h3 className="card-title">
                  {editingId ? "Editar Tarea" : "Crear Tarea"}
                </h3>
                <form onSubmit={handleSubmit}>
                  {error && <div className="alert alert-danger">{error}</div>}
                  {success && (
                    <div className="alert alert-success">{success}</div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Título
                    </label>
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
                    <label htmlFor="description" className="form-label">
                      Descripción
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="form-control"
                      rows="3"
                      value={formValues.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>
       
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isLoadingForm}
                  >
                    {isLoadingForm
                      ? "Guardando..."
                      : editingId
                      ? "Actualizar Tarea"
                      : "Guardar Tarea"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="btn btn-secondary w-100 mt-2"
                      onClick={handleResetForm}
                    >
                      Cancelar Edición
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/*  Tareas */}
          <div className="col-md-8">
            <h2>Lista de Tareas</h2>

            {/* tareas recientes */}
            {recentTasks.length > 0 && (
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Tareas Recientes</h5>
                </div>
                <div className="card-body">
                  <div className="list-group">
                    {recentTasks.map((task) => (
                      <div key={task.id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6
                              className={`mb-1 ${
                                task.is_completed
                                  ? "text-decoration-line-through text-muted"
                                  : ""
                              }`}
                            >
                              {task.title}
                            </h6>
                            <p className="mb-1 text-muted small">
                              {task.description}
                            </p>
                          </div>
                          <span
                            className={`badge ${
                              task.is_completed ? "bg-success" : "bg-warning"
                            }`}
                          >
                            {task.is_completed ? "Completada" : "Pendiente"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* lista completa de tareas */}
            {tasks.length === 0 ? (
              <p>No tienes tareas pendientes.</p>
            ) : (
              <div className="list-group">
                {tasks.map((task) => ( //para cada tarea hace un div y muestra la info
                  <div
                    key={task.id}
                    className="list-group-item list-group-item-action shadow-sm mb-2 rounded"
                  >
                    <div className="d-flex w-100 justify-content-between"> 
                      <h5
                        className={`mb-1 ${
                          task.is_completed
                            ? "text-decoration-line-through text-muted"
                            : ""
                        }`} // muestra el titulo de la tarea con linea tachada si esta completada 
                      >
                        {task.title}
                      </h5>
                      <small className="text-muted">
                        Creada: {new Date(task.createdAt).toLocaleDateString()}
                      </small>{" "}{/* muestra la fecha de creacion de la tarea */}
                    </div>
                    <p
                      className={`mb-1 ${
                        task.is_completed
                          ? "text-decoration-line-through text-muted"
                          : ""
                      }`} // muestra la descripcion de la tarea con linea tachada si esta completada 
                    >
                      {task.description}
                    </p> 
                    <div className="mt-2">
                      <button
                        className={`btn btn-sm ${
                          task.is_completed
                            ? "btn-outline-warning"
                            : "btn-outline-success"
                        }`} // boton para marcar la tarea como completada o pendiente
                        onClick={() => handleToggleComplete(task)}
                      >
                        {task.is_completed
                          ? "Marcar Pendiente"
                          : "Marcar Completada"}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary ms-2"
                        onClick={() => handleEdit(task)} //para editar
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={() => handleDelete(task.id)} //para eliminar
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};
