
import RequireAuth from './components/RequireAuth';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './routes/Login.jsx';
import Home from './routes/Home.jsx';
import Config from './routes/Config.jsx';
import Register from './routes/Register.jsx';
import Reports from './routes/Reports.jsx';
import Admin from './routes/Administrator.jsx';
import Help from './routes/Help.jsx';
import Unauthorized from './routes/Unauthorized.jsx';

import '../scss/custom.scss';

import { AuthProvider } from './context/AuthProvider.jsx';
import Recovery from './routes/Recovery.jsx';
import UserList from './routes/UserList.jsx';
import UserDetails from './routes/UserDetails.jsx';
import FirstLogin from './routes/FirstLogin.jsx';


const ROLES = {
  'User': "ROLE_USER",
  'Admin': "ROLE_ADMIN"
}


const AppRouter = (
  <Routes>
    {/* Rotas públicas */}
    <Route path="/login" element={<Login />} />
    <Route path="/help" element={<Help />} />
    <Route path="/unauthorized" element={<Unauthorized />} />
    <Route path='/recovery' element={<Recovery />} />
    <Route path="/register" element={<Register />} />

    {/* Rota protegidas */}
    <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.User]} />}>
      <Route path="/" element={<Home />} />
      <Route path="/first_login" element={<FirstLogin />} />
    </Route>

    {/* Outras rotas protegidas */}
    <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
      <Route path="/config" element={<Config />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/users/:id" element={<UserDetails />} />
      <Route path="/report" element={<Reports />} />
      <Route path="/admin" element={<Admin />} />
    </Route>
  </Routes>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>{AppRouter}</BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
);



// ANTIGO, BASEADO NO EXEMPLO DO VÍDEO DE MATHEUS BATTISTI REACT-ROUTER  COM createRouterBrowser   (testar futuramente se funciona com este modelo... hj )
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { createBrowserRouter, RouterProvider, Route, Outlet } from 'react-router-dom';

// import 'bootstrap/dist/css/bootstrap.min.css';

// import Login from './routes/Login.jsx';
// import Home from './routes/Home.jsx';
// import Config from './routes/Config.jsx';
// import Register from './routes/Register.jsx';
// import Reports from './routes/Reports.jsx';
// import Admin from './routes/Administrator.jsx';
// import Help from './routes/Help.jsx';
// import App from './App.jsx';

// import './index.css';

// import { AuthProvider } from './context/AuthProvider.jsx';

// const router = createBrowserRouter([
//   {
//     //path: "/",
//     element: <App />,
//     children: [
//       {
//         path: "/",
//         element: <RequireAuth><Home /></RequireAuth>,
//       },
//       {
//         path: "/login",
//         element: <Login />,
//       },
//       {
//         path: "/register",
//         element: <RequireAuth><Register /></RequireAuth>,
//       },
//       {
//         path: "/config",
//         element: <RequireAuth><Config /></RequireAuth>,
//       },
//       {
//         path: "/report",
//         element: <RequireAuth><Reports /></RequireAuth>,
//       },
//       {
//         path: "/admin",
//         element: <RequireAuth><Admin /></RequireAuth>,
//       },
//       {
//         path: "/help",
//         element: <Help />,
//       },
//     ],
//   },
// ]);