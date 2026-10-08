import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserManagement from '../components/UserManagement';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('summary');

  // Helper para verificar si el usuario posee un rol específico
  const hasRole = (roleName) => {
    if (!user || !user.roles) return false;
    return user.roles.some((r) => {
      const name = typeof r === 'object' ? (r.nombre_rol || r.authority || r.nombre) : r;
      return name === roleName;
    });
  };
// Verifica si el usuario es ADMINISTRADOR
  const isAdmin = hasRole('ADMINISTRADOR');

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar de Navegación */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-4">
        <div>
          <div className="p-4 border-b border-slate-800">
            <h1 className="text-xl font-bold text-emerald-400">HGCO Auth</h1>
            <p className="text-xs text-slate-500">
              {isAdmin ? 'Panel de Administración' : 'Panel de Funcionario'}
            </p>
          </div>
          <nav className="mt-6 space-y-2">
            {/* 1. Resumen General (Visible para TODOS los usuarios) */}
            <button
              type="button"
              onClick={() => setActiveTab('summary')}
              className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition cursor-pointer ${
                activeTab === 'summary'
                  ? 'bg-slate-800 text-white'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              📊 Resumen General
            </button>

            {/* PESTAÑAS ADMINISTRATIVAS (Solo visibles para el ADMINISTRADOR) */}
            {isAdmin && (
              <>
                <div className="pt-4 pb-1">
                  <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Gestión del Sistema
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('users')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition cursor-pointer ${
                    activeTab === 'users'
                      ? 'bg-slate-800 text-white'
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  👥 Gestión de Usuarios
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('roles')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition cursor-pointer ${
                    activeTab === 'roles'
                      ? 'bg-slate-800 text-white'
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  🔑 Roles y Permisos
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('services')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition cursor-pointer ${
                    activeTab === 'services'
                      ? 'bg-slate-800 text-white'
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  🏥 Servicios Hospitalarios
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Pie de Sidebar: Perfil y Cierre de Sesión */}
        <div className="p-4 border-t border-slate-800">
          <div className="mb-3">
            <p className="text-sm font-semibold text-white">{user?.username}</p>
            <p className="text-xs text-emerald-400 font-mono">
              {user?.roles?.map((r) => (typeof r === 'object' ? r.nombre_rol || r.nombre : r)).join(', ')}
            </p>
          </div>
          <button
            onClick={logout}
            className="w-full py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-sm font-medium transition cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Área Principal de Contenido */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Bienvenido, {user?.nombre ? `${user.nombre} ${user.apellido}` : user?.username}
            </h2>
            <p className="text-slate-500 text-sm">
              {isAdmin 
                ? 'Control e infraestructura del Microservicio de Autenticación' 
                : 'Módulo de acceso a servicios hospitalarios'}
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
            Sistema Activo
          </span>
        </header>

        {/* 1. Resumen General */}
        {activeTab === 'summary' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500">
                  Roles Asignados
                </h3>
                <p className="text-2xl font-bold text-slate-800 mt-2">
                  {user?.roles?.length || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500">
                  Servicios Asociados
                </h3>
                <p className="text-2xl font-bold text-slate-800 mt-2">
                  {user?.servicios?.length || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500">
                  Estado de la Sesión
                </h3>
                <p className="text-lg font-bold text-emerald-600 mt-2">
                  Autenticado / Activo
                </p>
              </div>
            </div>

            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Servicios Hospitalarios Permitidos
              </h3>
              <div className="flex flex-wrap gap-2">
                {user?.servicios && user.servicios.length > 0 ? (
                  user.servicios.map((srv, idx) => {
                    const nombreServicio = typeof srv === 'object' ? (srv.nombreServicio || srv.nombre) : srv;
                    return (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium"
                      >
                        🏥 {nombreServicio}
                      </span>
                    );
                  })
                ) : (
                  <p className="text-slate-400 text-sm">
                    No hay servicios específicos asignados a tu usuario.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Solo el Administrador puede renderizar los módulos de gestión */}
        {isAdmin && (
          <>
            {/* 2. Gestión de Usuarios */}
            {activeTab === 'users' && <UserManagement />}

            {/* 3. Roles y Permisos */}
            {activeTab === 'roles' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Gestión de Roles y Permisos
                </h3>
                <p className="text-slate-500 text-sm">
                  Módulo para administrar los roles del sistema (ej. ADMINISTRADOR, MEDICO).
                </p>
              </div>
            )}

            {/* 4. Servicios Hospitalarios */}
            {activeTab === 'services' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Gestión de Servicios Hospitalarios
                </h3>
                <p className="text-slate-500 text-sm">
                  Módulo para parametrizar áreas del hospital (Quirófano, Urgencias, Nutrición, etc.).
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}