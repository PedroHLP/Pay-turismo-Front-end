import { useState, useEffect } from "react";
import React from 'react';
import { Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import automationFetch from "../axios/config";

const Recovery = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Seu código de useEffect, se necessário
  }, []);

  const recoveryPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await automationFetch.post('/users/reset-password', { email });
      console.log(response.data);
      // Você pode redirecionar ou mostrar uma mensagem de sucesso aqui
    } catch (error) {
      console.error(error);
      // navigate('/login', { state: { from: location }, replace: true });
    }
  };

  return (
    <div className="title_general">
      <h1>Recuperação de Senha</h1>
      <br />
      <form onSubmit={recoveryPassword}>
        <input
          className="input_recovery"
          type='text'
          name='email'
          id='email'
          placeholder='Digite o email'
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <br />
        <Button variant="secondary" type='submit'>ENVIAR</Button>{' '}
      </form>
    </div>
  );
}

export default Recovery;
