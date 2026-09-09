import { useState, useEffect } from 'react';
import { getUsers, createUser, toggleUserStatus } from '../api/users';

export default function UserManagement() {
    const [users, setUsers] = useState([]); // estado para almacenar la lista de usuarios, se inicializa como un array vacio
    const [loading, setLoading] = useState(true); // estado para controlar la carga de datos, inicializado como true
    const [showModal, setShowModal] = useState(false); // estado para controlar la visibilidad del modal de creación de usuario
    const [error, setError] = useState(''); // estado para almacenar mensajes de error

    const [formData, setFormData] = useState({  // estado para almacenar los datos del formulario de creación de usuario
    ci: '',
    nombre: '',
    apellido: '',
    username: '',
    password: '',
    descripcion: '',
    active: true,
    roles: [],
    servicios: []
  });

    useEffect(() => {
        fetchUsers(); // llamada a la funcion para obtener la lista de usuarios cuando el componenete se carga por 1era vez
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true); 
            const data = await getUsers(); // llamada a la funcion que obtiene los usuarios desde el backend
            setUsers(data); // actualiza el estado con la lista de usuarios 
            } catch (err) {
                setError('Error al cargar los usuarios'); // si ocurre un error se actualiza el estado error
            } finally {
                setLoading(false);
            }
    };

    const handleCreateSubmit = async (e) => { // funcion que maneja el envio del formulario de creacion de usuario
        e.preventDefault();  // previene el comportamiento por defecto del formulario
        try {  
        await createUser(formData); // llama a la funcion que crea un nuevo usuario en el backend con los datos del formulario
        setShowModal(false);  // cierra el modal de creacion de usuario
        setError(''); // limpia cualquier mensaje de error previo
        setFormData({
        ci: '',
        nombre: '',
        apellido: '',
        username: '',
        password: '',
        descripcion: '',
        active: true,
        roles: [],
        servicios: []
      });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el usuario.'); 
    }
  };

  const handleToggleStatus = async (user) => { // funcion que maneja el cambio de estado activo/inactivo de un usuario
    const nextState = !user.active; // determina el nuevo estado del usuario
    const actionText = nextState ? 'activar' : 'desactivar'; // texto para el mensaje de confirmacion
    
    if (confirm(`¿Estás seguro de que deseas ${actionText} al usuario ${user.username}?`)) {
        try {
            await toggleUserStatus(user.id, nextState); // llama a la funcion que alterna el estado del usuario en el backend
            fetchUsers(); // actualiza la lista de los usuarios despues de cambiar el estado
        } catch (err) {
            alert(`No se pudo ${actionText} el usuario.`); // muestra un mensaje de error si ocurre un problema
        }
    }
  };

  return (
    // contenedor principal del componente de gestion de usuarios
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">  
      <div className="flex justify-between items-center mb-6">  
        <div>
          <h3 className="text-lg font-bold text-slate-800">Directorio de Usuarios</h3>  
          <p className="text-slate-500 text-sm">Gestiona accesos, roles y servicios asignados</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm"
        >
          + Nuevo Usuario
        </button>
      </div>
      {error && <div className="p-3 mb-4 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase bg-slate-50">
              <th className="py-3 px-4">Usuario</th>
              <th className="py-3 px-4">C.I.</th>
              <th className="py-3 px-4">Nombre Completo</th>
              <th className="py-3 px-4">Roles</th>
              <th className="py-3 px-4">Servicios</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-6 text-center text-slate-400">Cargando directorio...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-6 text-center text-slate-400">No hay usuarios registrados.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{u.username}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">{u.ci}</td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <div>{u.nombre} {u.apellido}</div>
                    {u.descripcion && <span className="text-xs text-slate-400">{u.descripcion}</span>}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {u.roles && u.roles.length > 0 ? (
                        u.roles.map((r, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-mono text-xs rounded border border-emerald-200">
                            {typeof r === 'object' ? r.nombre : r}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">Sin roles</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {u.servicios && u.servicios.length > 0 ? (
                        u.servicios.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                            🏥 {typeof s === 'object' ? s.nombre : s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">Sin servicio</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        u.active ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {u.active ? '● Activo' : '○ Inactivo'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className={`text-xs font-semibold px-3 py-1 rounded transition ${
                        u.active ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {u.active ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para Crear Usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Registrar Nuevo Usuario</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Cédula de Identidad (C.I.)"
                required
                value={formData.ci}
                onChange={(e) => setFormData({ ...formData, ci: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-emerald-500"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nombre"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  required
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-emerald-500"
                />
              </div>

              <input
                type="text"
                placeholder="Nombre de Usuario (Username)"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-emerald-500"
              />

              <input
                type="password"
                placeholder="Contraseña"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-emerald-500"
              />

              <textarea
                placeholder="Descripción (ej. Médico Cirujano principal de Quirófano)"
                rows="2"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-emerald-500"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
                >
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}