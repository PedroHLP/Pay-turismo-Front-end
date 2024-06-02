import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Offcanvas from 'react-bootstrap/Offcanvas';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FcInspection } from "react-icons/fc";
import { IoMdHome } from "react-icons/io";
import { GoGear } from 'react-icons/go'
import { RiAdminLine } from 'react-icons/ri'
import { TbReportAnalytics } from 'react-icons/tb'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { TbHelpSquare } from 'react-icons/tb'
import { BiLogOut } from 'react-icons/bi'

import useAuth from '../hooks/useAuth';

import logo from '../assets/logo-w3l.png';
import { Image } from 'react-bootstrap';
import { INSPECTIONS_ADD_PATH, INSPECTIONS_PATH } from '../paths';

const Header = () => {
  const { auth } = useAuth() // consumir  Context 08Nov23 (array)
  const navDropdownTitleAdmin = (<><RiAdminLine/> Administração</>) // para que seja possivel adicionar um icone ao navdropdown
  const navDropdownTitleUser = (<Navbar.Text> Olá, <span className="text-white">{auth.user}</span></Navbar.Text> )

  return (
      <>
    {[false].map((expand) => (
      <header>
          <Navbar key={expand} expand={expand} bg="dark" data-bs-theme="dark" className="mb-4 text-white">
              <Container fluid>
                  <div className="d-inline-flex align-middle">
                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`}/>  
                    <Navbar.Brand as={Link} to="/" className="mx-4"><Image src={logo} width={100}/></Navbar.Brand>
                  </div>

                  <Navbar.Offcanvas
                  id={`offcanvasNavbar-expand-${expand}`}
                  aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                  placement="start"
                  bg="dark" data-bs-theme="dark"
                  >
                      
                      <Offcanvas.Header closeButton>
                          <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                          Monitoramento
                          </Offcanvas.Title>
                      </Offcanvas.Header>

                      <Offcanvas.Body>
                          <Nav className="justify-content-center flex-grow-1 pe-3">
                            {/* as={Link} para poder usar o react router */}
                            <Nav.Link as={Link} to="/"><IoMdHome/> Dashboard</Nav.Link>
                            <Nav.Link as={Link} to="/config"><GoGear/> Configurações</Nav.Link>
                            <Nav.Link as={Link} to={INSPECTIONS_PATH}><FcInspection/> Inspeções</Nav.Link>
                            <NavDropdown
                                title= {navDropdownTitleAdmin}
                                id={`offcanvasNavbarDropdown-expand-${expand}`}
                            >
                                <NavDropdown.Item as={Link} to='/report'><TbReportAnalytics /> Relatórios</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to='/register'><AiOutlineUserAdd /> Novo Usuário</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/admin"> /admin</NavDropdown.Item>
                            </NavDropdown>
                          </Nav>
                      </Offcanvas.Body>
                  </Navbar.Offcanvas>
                    
                    <div className="mx-3">
                        <NavDropdown
                        title={navDropdownTitleUser}
                        menuVariant="dark"
                        align="end"
                        >
                            <NavDropdown.Item as={Link} to='/help'><TbHelpSquare /> Ajuda</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to='/login'><BiLogOut /> Desconectar</NavDropdown.Item>
                        </NavDropdown>
                    </div>
              </Container>
          </Navbar>
      </header>
      ))}
      </>
)
}

export default Header;
