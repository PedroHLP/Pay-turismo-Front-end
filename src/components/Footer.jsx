import { Col, Container, Row } from 'react-bootstrap';

const Footer = () => {

  return (
    <footer>
        <div className="mt-5 p-3 bg-dark text-white">
            <Container>
                <Row>
                    <Col>
                        <div className="text-center">
                            © 2024 <a href="https://www.w3lsolucoes.com.br/">W3L Soluções</a>. All Rights Reserved
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    </footer>
  )
}

export default Footer;
