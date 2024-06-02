import React, { useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';


const Help = () => {

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {

    } catch (error) {
      navigate('/login', { state: { from: location }, replace: true })
    }
  },[])

  return (
    <div>
      <h1>Página de ajuda</h1>
    </div>
  )
}

export default Help