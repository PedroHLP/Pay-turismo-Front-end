import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <section className="section_unauthorized">
            <h1>Não Autorizado</h1>
            <br />
            <p>Sem permissão de acesso a esta página!</p>
            <div className="flexGrow">
                <button className="button_unauthorized" onClick={goBack}>Go Back</button>
            </div>
        </section>
    )
}

export default Unauthorized