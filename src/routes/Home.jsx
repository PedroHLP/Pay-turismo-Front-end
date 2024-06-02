import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAutomationFetchPrivate from '../hooks/useAutomationFetchPrivate';
import RobotImage from '../functions/ImageSelection';
import { useNavigate, useLocation } from "react-router-dom";
import Header from '../components/Header';
import { Col, Container, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import Footer from '../components/Footer';

const GET_ROBOT_URL = '/automations/all';

function Home() {

  const [posts, setPosts] = useState([]);
  const automationFetchPrivate = useAutomationFetchPrivate();

  const navigate = useNavigate();
  const location = useLocation();

  const getPosts = async () => {
    try {

      const response = await automationFetchPrivate.get(GET_ROBOT_URL);
      const data = response.data;

      setPosts(data);

    } catch (error) {
      console.log(error);
      navigate('/login', { state: { from: location }, replace: true })
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  // State to hold the width of the border
  const [borderWidth, setBorderWidth] = useState(0);

  // Function to calculate the border width
  useEffect(() => {
    const borderElement = document.querySelector('.border');
    if (borderElement) {
      const computedStyle = window.getComputedStyle(borderElement);
      const borderWidth = parseFloat(computedStyle.getPropertyValue('border-width'));
      setBorderWidth(borderWidth);
    }
  }, []);

  return (
    <>
      <Header/>
        <Container fluid>
          <main className="mx-5 px-4 py-3 border border-secondary bg-light">
            <Row className="align-items-center">
              {posts.length === 0 ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                posts.map((post) => (
                  <Col xs={7} sm={5} md={4} lg={3} xl={2}>
                    <Link to={`/config`} className="link-underline link-underline-opacity-0">
                      <div key={post.id} className="text-center px-4 py-3 m-2 bg-light">
                        <img
                          src={RobotImage(post.statusAutomacao)}
                          alt={post.statusAutomacao}
                          height="50"
                          className="mb-1"
                        />
                        <div className="text-uppercase">
                          <OverlayTrigger
                            key={post.id}
                            placement="bottom"
                            overlay={<Tooltip id={`tooltip-${post.id}`}>{post.nomeAutomacao}</Tooltip>}
                            delay={{ show: 500 }}
                          >
                            <div className="text-dark">
                              {post.nomeAutomacao}
                            </div>
                          </OverlayTrigger>
                        </div>
                      </div>
                    </Link>
                  </Col>
                ))
              )}
            </Row>
          </main>
        </Container>
      <Footer />
    </>
  );
}

export default Home;
