import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'



const Header = () => {

  const userName = localStorage.getItem('userName') 

  const navigate = useNavigate()

  const logout = (props) => {
    localStorage.removeItem('userName')
    localStorage.removeItem('user')
    console.log('successfully logged out')
    
    navigate('/login')
  }
  return ( 
 
      <Navbar className="bg-body-tertiary mb-4 mt-2">
      <Container>
        <Navbar.Brand href="#home"><h2>{userName}</h2></Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Button variant="primary" onClick={logout}>Logout</Button> 
        </Navbar.Collapse>
      </Container>
        </Navbar>
   
      
 
     )
}

export default Header