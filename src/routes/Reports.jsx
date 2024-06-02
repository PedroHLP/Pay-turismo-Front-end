import { useEffect } from "react"
import React from 'react'

import { useNavigate, useLocation } from "react-router-dom"
import Header from "../components/Header";

const Reports = () => {

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {

    } catch (error) {
      navigate('/login', { state: { from: location }, replace: true })
    }
  }, [])

  return (
    <div>
      <Header />
      <h1>Relatórios do Sistema</h1>
    </div>
  )
}

export default Reports