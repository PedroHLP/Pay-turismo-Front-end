
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
import InspectionForm from './routes/InspectionForm.jsx';

import '../scss/custom.scss';

import { AuthProvider } from './context/AuthProvider.jsx';
import Recovery from './routes/Recovery.jsx';
import { INSPECTIONS_ADD_PATH, INSPECTIONS_PATH } from './paths.jsx';
import InspectionList from './routes/InspectionList.jsx';


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

    {/* Rota protegidas */}
    <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.User]} />}>
      <Route path="/" element={<Home />} />
    </Route>

    {/* Outras rotas protegidas */}
    <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
      <Route path="/register" element={<Register />} />
      <Route path="/config" element={<Config />} />
      <Route path="/report" element={<Reports />} />
      <Route path="/admin" element={<Admin />} />
      <Route path={INSPECTIONS_PATH} element={<InspectionList />} />
      <Route path={INSPECTIONS_ADD_PATH} element={<InspectionForm />} />
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