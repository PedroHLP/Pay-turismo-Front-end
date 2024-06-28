import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Offcanvas from 'react-bootstrap/Offcanvas';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { TbHelpSquare } from 'react-icons/tb'
import { BiLogOut } from 'react-icons/bi'
import { FaHouse, FaMagnifyingGlass, FaMoneyBill, FaPlus, FaShop, FaUser } from 'react-icons/fa6';

import useAuth from '../hooks/useAuth';

const Header = () => {
    const { auth } = useAuth() // consumir  Context 08Nov23 (array)
    const navDropdownTitleEstabelecimento = (<><FaShop /> Estabelecimento</>)
    const navDropdownTitleUser = (<Navbar.Text> Olá, <span className="text-white">{auth.user}</span></Navbar.Text>)

    return (
        <>
            <header>
                <Navbar expand={false} bg="primary" data-bs-theme="dark" className="mb-4">
                    <Container fluid>
                        <div className="d-inline-flex align-middle">
                            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-false`} />
                        </div>

                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-false`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-false`}
                            placement="start"
                            data-bs-theme="light"
                        >

                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-false`}>
                                    PayZen Integrator
                                </Offcanvas.Title>
                            </Offcanvas.Header>

                            <Offcanvas.Body>
                                <Nav className="justify-content-center flex-grow-1 pe-3">
                                    <Nav.Link as={Link} to="/"><FaHouse /> Home</Nav.Link>
                                    <NavDropdown
                                        title={navDropdownTitleEstabelecimento}
                                        id={`offcanvasNavbarDropdown-expand-false`}
                                    >
                                        <NavDropdown.Item as={Link} to='#'><FaPlus /> Novo</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to='#'><FaMagnifyingGlass /> Consultar</NavDropdown.Item>
                                    </NavDropdown>
                                    <Nav.Link as={Link} to="#"><FaMoneyBill /> Vendas</Nav.Link>
                                    <NavDropdown
                                        title='Administração'
                                        id={`offcanvasNavbarDropdown-expand-false`}
                                    >
                                        <NavDropdown.Item as={Link} to='/users'><FaUser /> Usuários</NavDropdown.Item>
                                    </NavDropdown>
                                </Nav>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>

                        <div className="mx-3">
                            <NavDropdown
                                title={navDropdownTitleUser}
                                align="end"
                                data-bs-theme="light"
                            >
                                <NavDropdown.Item as={Link} to='/help'><TbHelpSquare /> Ajuda</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to='/login'><BiLogOut /> Desconectar</NavDropdown.Item>
                            </NavDropdown>
                        </div>
                    </Container>
                </Navbar>
            </header>
        </>
    )
}

export default Header;
