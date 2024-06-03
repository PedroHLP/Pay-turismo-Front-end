import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Col, Container, ProgressBar, Row, Table } from 'react-bootstrap';
import { FaCalendarDays, FaClock, FaCheck, FaPix, FaCreditCard } from "react-icons/fa6";


function Home() {

  const salesPlaceholder = [{
    id: 1,
    date: '02/06/2024',
    status: 1,
    description: 'pagamento taxa',
    value: 10.00,
    type: 1
  },{
    id: 2,
    date: '02/06/2024',
    status: 1,
    description: 'peça de aço inox',
    value: 460.00,
    type: 2
  },{
    id: 3,
    date: '02/06/2024',
    status: 0,
    description: 'internet',
    value: 79.99,
    type: 0
  },{
    id: 4,
    date: '02/06/2024',
    status: 1,
    description: 'aluguel',
    value: 1500.00,
    type: 2
  }]

  const salesTableRows = salesPlaceholder.map((sale) => (
    <tr className="text-center" key={sale.id} value={sale.id}>
    <td>{sale.date}</td>
    <td>{sale.status ? (<FaCheck className="text-success"/>) : (<FaClock className="text-warning"/>)}</td>
    <td>{sale.description}</td>
    <td>R$ {sale.value}</td>
    <td className="text-success">
      {sale.type === 1 ? (
        <FaPix />
      ) : sale.type === 2 ? (
        <FaCreditCard />
      ) : (
        <FaClock className="text-warning"/>
      )}
    </td>
    </tr>
  ))

  return (
    <>
      <Header/>
        <Container fluid>
          <Row>
            <Col className="pb-4" sm={4}>
              <div className="shadow-sm p-3 bg-body-tertiary rounded">
                <div className="mb-3">
                  <Row>
                    <Col>
                      <span className='fw-semibold'>Extrato</span>
                    </Col>
                    <Col className="text-end">
                      <span className="mx-1">Últimos 10 dias</span>
                      <Link to="#" className="link-dark">
                        <FaCalendarDays />
                      </Link>
                    </Col>
                  </Row>
                  <hr />
                </div>
                <div className="mb-2">
                  <Row>
                    <Col>
                      <span>Entrada</span>
                    </Col>
                    <Col className="text-end">
                      <span>R$ 0,00</span>
                    </Col>
                  </Row>
                  <ProgressBar variant="success" now={60} />
                </div>
                <div className="mb-3">
                  <Row>
                    <Col>
                      <span>Saída</span>
                    </Col>
                    <Col className="text-end">
                      <span>R$ 0,00</span>
                    </Col>
                  </Row>
                  <ProgressBar variant="danger" now={35}/>
                </div>
                <div className="text-end">
                  <Link to="#" className="link-dark text-decoration-none">
                    Ver todos
                  </Link>
                </div>
              </div>
            </Col>

            <Col className="pb-4" sm={8}>
              <div className="shadow-sm p-3 bg-body-tertiary rounded">
              <div className="mb-3">
                  <Row>
                    <Col>
                      <span className='fw-semibold'>Vendas</span>
                    </Col>
                    <Col className="text-end">
                      <span className="mx-1">Últimos 10 dias</span>
                      <Link to="#" className="link-dark">
                        <FaCalendarDays />
                      </Link>
                    </Col>
                  </Row>
                  <hr />
                  <Table hover responsive>
                    <thead className="text-center">
                      <tr>
                      <th>Data</th>
                      <th>Status</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                      <th>Tipo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesTableRows}
                    </tbody>
                    </Table>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
    </>
  );
}

export default Home;
