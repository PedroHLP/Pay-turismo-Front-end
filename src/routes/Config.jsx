import { useEffect } from "react";
import { Button } from "react-bootstrap";

import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";

const Config = () => {

    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
      try {
  
      } catch (error) {
        navigate('/login', { state: { from: location }, replace: true })
      }
    },[])    

    const createPost = async (e) => {
        e.preventDefault();

    };

    return (
    <div className='new-post'>
        <Header />
        <h2>Configurações dos Robôs</h2>
        <form onSubmit={(e) => createPost(e)}>
            <div className='form-control'>
                <label htmlFor='title'>Nome:</label>
                <input
                    type='text'
                    name='title'
                    id='title'
                    placeholder='Digite o Nome'
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className='form-control'>
                <label htmlFor='body'>Detalhes:</label>
                <textarea
                    name='body'
                    id='body'
                    placeholder='Descreva os Detalhes...'
                    onChange={(e) => setBody(e.target.value)}
                ></textarea>
            </div>
            <Button  variant="secondary" type='submit'>INCLUIR</Button>{' '}
        </form>
    </div>
    )
};

export default Config