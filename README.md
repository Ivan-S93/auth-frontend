# 🛡️ Auth Frontend - Módulo Central de Autenticación (React + Vite)

Interfaz web moderna, responsiva e institucional desarrollada con **React**, **Vite** y **Tailwind CSS**. Este proyecto actúa como la capa cliente desacoplada que consume los servicios de autenticación y autorización del microservicio `auth-service` (Spring Boot + PostgreSQL).

---

## 🚀 Propósito del Proyecto

Servir como portal centralizado de inicio de sesión para los sistemas institucionales (como el sistema HIS, monitores de quirófano y llamador de turnos), gestionando de manera segura la sesión del usuario basada en **JSON Web Tokens (JWT)**, sus **roles** asignados y los **servicios hospitalarios** a los que tiene acceso.

---

## 🛠️ Tecnologías Utilizadas

* **React 18+ / 19** - Librería para la interfaz de usuario.
* **Vite** - Herramienta de compilación y empaquetado rápido.
* **Tailwind CSS (v4)** - Framework de diseño utilitario para estilos e interfaz adaptativa.
* **Axios** - Cliente HTTP para peticiones REST e interceptores de seguridad.
* **React Router DOM** - Enrutamiento dinámico y protección de rutas según roles.
* **ESLint** - Control de calidad de código y detección de errores de sintaxis.

---

## 📁 Estructura del Proyecto

```text
auth-frontend/
├── src/
│   ├── api/
│   │   └── axios.js          # Instancia centralizada de Axios con interceptor Bearer Token
│   ├── context/
│   │   └── AuthContext.jsx   # Estado global de autenticación, usuario, roles y JWT
│   ├── components/
│   │   └── ProtectedRoute.jsx# Componente de protección de rutas por autenticación/rol
│   ├── pages/
│   │   ├── Login.jsx         # Formulario de inicio de sesión estilizado con Tailwind CSS
│   │   └── Dashboard.jsx     # Panel principal con información del usuario y accesos
│   ├── App.jsx               # Rutas de la aplicación
│   ├── index.css             # Configuración e importación global de Tailwind CSS
│   └── main.jsx              # Punto de entrada de la aplicación React
├── index.html
├── vite.config.js            # Configuración de Vite y plugins (Tailwind, React)
└── package.json
