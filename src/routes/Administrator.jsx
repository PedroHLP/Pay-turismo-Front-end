import React from 'react';
import Users from './Users';
import Header from '../components/Header';

const Administrator = () => {
  return (
    <div>
      <Header />
      <h1>Página de Administradores</h1>
      <br />
      <Users />
      <br />
    </div>
  )
}

export default Administrator