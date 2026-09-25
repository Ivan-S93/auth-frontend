import { useState, useEffect } from 'react';
import { getUsers, createUser, toggleUserStatus } from '../api/users';
import { getRoles } from '../api/roles';
import { getServicios } from '../api/services';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [rolesDisponibles, setRolesDisponibles] = useState([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado del Formulario
  const [formData, setFormData] = useState({
    ci: '',
    nombre: '',
    apellido: '',
    username: '',
    password: '',
    descripcion: '',
    roles: [],
    servicios: []
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError('');

      // Cargar lista de usuarios
      const usersData = await getUsers();
      setUsers(usersData);

      // Cargar Catálogo de Roles desde la BD
      try {
        const rolesData = await getRoles();
        setRolesDisponibles(rolesData);
      } catch (e) {
        console.warn('Endpoint /roles aún no expuesto en backend.');
      }

      // Cargar Catálogo de Servicios desde la BD
      try {
        const serviciosData = await getServicios();
        setServiciosDisponibles(serviciosData);
      } catch (e) {
        console.warn('Endpoint /servicios aún no expuesto en backend.');
      }

    } catch (err) {
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Función para alternanr el estado activo/inactivo de un usuario
  const handleToggleActive = async (id, currentStatus) => {
    try {
      await toggleUserStatus(id, !currentStatus);
      setUsers(users.map(u => u.id === id ? { ...u, active: !currentStatus } : u));
    } catch (err) {
      alert('No se pudo cambiar el estado del usuario.');
    }
  };


  // Función para manejar cambios en los checkboxes de roles y servicios
  const handleCheckboxChange = (category, value) => {
    setFormData(prev => {
      const list = prev[category];
      const updatedList = list.includes(value)
        ? list.filter(item => item !== value)
        : [...list, value];
      return { ...prev, [category]: updatedList };
    });
  };


  // Función para manejar el envío del formulario de creación de usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData);
      setIsModalOpen(false);
      setFormData({
        ci: '', nombre: '', apellido: '', username: '', password: '',
        descripcion: '', roles: [], servicios: []
      });
      // Recargar la tabla con el nuevo usuario
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al guardar el usuario.');
    }
  };

  // Renderizado condicional mientras se cargan los datos
  if (loading) return <div className="p-4 text-slate-500">Cargando datos del sistema...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Gestión de Usuarios</h3>
          <p className="text-slate-500 text-sm">Administra las identidades y asignaciones del HGCO.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
        >
          + Nuevo Usuario
        </button>
      </div>

      {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

      {/* Tabla de Usuarios */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
              <th className="p-3">CI</th>
              <th className="p-3">Nombre Completo</th>
              <th className="p-3">Usuario</th>
              <th className="p-3">Roles</th>
              <th className="p-3">Servicios</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition">
                <td className="p-3 font-mono text-xs">{u.ci}</td>
                <td className="p-3 font-medium text-slate-800">{u.nombre} {u.apellido}</td>
                <td className="p-3 text-slate-600">{u.username}</td>

                {/* Visualización adaptable de Roles */}
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {u.roles && u.roles.length > 0 ? (
                      u.roles.map((r, i) => {
                        const roleText = typeof r === 'object'
                          ? (r.nombre_rol || r.nombre || r.name || r.authority)
                          : r;

                        return (
                          <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-medium">
                            {roleText}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </div>
                </td>

                {/* Display de Servicios  */}
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {u.servicios && u.servicios.length > 0 ? (  // Verifica si hay servicios asignados
                      u.servicios.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs">
                          🏥 {typeof s === 'object' ? (s.nombreServicio || s.nombre) : s}
                        </span>
                      ))
                    ) : <span className="text-slate-400 text-xs">-</span>}
                  </div>
                </td>

                <td className="p-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {u.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleToggleActive(u.id, u.active)}
                    className={`text-xs px-3 py-1 rounded transition cursor-pointer font-medium ${u.active ? 'bg-slate-100 hover:bg-red-50 text-red-600' : 'bg-slate-100 hover:bg-emerald-50 text-emerald-600'
                      }`}
                  >
                    {u.active ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Crear Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Registrar Nuevo Usuario</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Cédula (CI)</label>
                  <input
                    type="text" required
                    className="w-full border border-slate-300 p-2 rounded-lg text-sm"
                    value={formData.ci}
                    onChange={e => setFormData({ ...formData, ci: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nombre de Usuario</label>
                  <input
                    type="text" required
                    className="w-full border border-slate-300 p-2 rounded-lg text-sm"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nombre</label>
                  <input
                    type="text" required
                    className="w-full border border-slate-300 p-2 rounded-lg text-sm"
                    value={formData.nombre}
                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Apellido</label>
                  <input
                    type="text" required
                    className="w-full border border-slate-300 p-2 rounded-lg text-sm"
                    value={formData.apellido}
                    onChange={e => setFormData({ ...formData, apellido: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Contraseña</label>
                <input
                  type="password" required
                  className="w-full border border-slate-300 p-2 rounded-lg text-sm"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {/* Selección de Rol con Lista Desplegable */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Seleccionar Rol</label>
                <select
                  className="w-full border border-slate-300 p-2 rounded-lg text-sm bg-white"
                  value={formData.roles[0] || ''}
                  onChange={(e) => setFormData({ ...formData, roles: e.target.value ? [e.target.value] : [] })}
                  required
                >
                  <option value="">-- Selecciona un Rol --</option>
                  {rolesDisponibles.map((role) => {
                    const roleName = typeof role === 'object' ? (role.nombre_rol || role.nombre || role.name) : role;
                    return (
                      <option key={roleName} value={roleName}>
                        {roleName}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Selección de Servicio Hospitalario con Lista Desplegable */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Seleccionar Servicio Hospitalario</label>
                <select
                  className="w-full border border-slate-300 p-2 rounded-lg text-sm bg-white"
                  value={formData.servicios[0] || ''}
                  onChange={(e) => setFormData({ ...formData, servicios: e.target.value ? [e.target.value] : [] })}
                  required
                >
                  <option value="">-- Selecciona un Servicio --</option>
                  {serviciosDisponibles.map((srv) => {
                    const serviceName = typeof srv === 'object' ? (srv.nombreServicio || srv.nombre) : srv;
                    return (
                      <option key={serviceName} value={serviceName}>
                        🏥 {serviceName}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
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