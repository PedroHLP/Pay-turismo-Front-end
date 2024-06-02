import { useEffect } from "react"
import React from 'react'
import { Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom"

const Recovery = () => {

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {

    } catch (error) {
      navigate('/login', { state: { from: location }, replace: true })
    }
  }, [])

  return (
    <div className="title_general">
      <h1>Recuperação de Senha</h1>
      <br />
      <form onSubmit={(e) => recoveryPassword(e)}>
        <input className="input_recovery"
          type='text'
          name='email'
          id='email'
          placeholder='Digite o email'
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <br />
        <Button variant="secondary" type='submit'>ENVIAR</Button>{' '}
      </form>
    </div>
  )
}

export default Recovery