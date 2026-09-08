import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar de Navegación */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-4">
        <div>
          <div className="p-4 border-b border-slate-800">
            <h1 className="text-xl font-bold text-emerald-400">HGCO Auth</h1>
            <p className="text-xs text-slate-500">Panel de Administración</p>
          </div>
          <nav className="mt-6 space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-slate-800 text-white font-medium">
              📊 Resumen General
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition">
              👥 Gestión de Usuarios
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition">
              🔑 Roles y Permisos
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition">
              🏥 Servicios Hospitalarios
            </a>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="mb-3">
            <p className="text-sm font-semibold text-white">{user?.username}</p>
            <p className="text-xs text-emerald-400 font-mono">
              {user?.roles?.join(', ')}
            </p>
          </div>
          <button
            onClick={logout}
            className="w-full py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-sm font-medium transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Área Principal de Contenido */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Bienvenido, {user?.username}</h2>
            <p className="text-slate-500 text-sm">Control e infraestructura del Microservicio de Autenticación</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
            Sistema Activo
          </span>
        </header>

        {/* Tarjetas de Métricas / Estado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500">Roles Asignados</h3>
            <p className="text-2xl font-bold text-slate-800 mt-2">{user?.roles?.length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500">Servicios Asociados</h3>
            <p className="text-2xl font-bold text-slate-800 mt-2">{user?.servicios?.length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500">Estado del Token</h3>
            <p className="text-lg font-bold text-emerald-600 mt-2">Válido (1 Hora)</p>
          </div>
        </div>

        {/* Detalle de Servicios Asignados */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Servicios Hospitalarios Permitidos</h3>
          <div className="flex flex-wrap gap-2">
            {user?.servicios && user.servicios.length > 0 ? (
              user.servicios.map((srv, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                  🏥 {srv}
                </span>
              ))
            ) : (
              <p className="text-slate-400 text-sm">No hay servicios específicos mapeados.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}