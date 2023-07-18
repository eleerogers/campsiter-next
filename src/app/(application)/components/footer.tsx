import React from 'react';
// import { useHistory, Link } from 'react-router-dom';
import Link from 'next/link'
import { Navbar, Container } from './bootstrap'


function Footer() {
//   const {
//     location: {
//       pathname
//     }
//   } = useHistory();

// pathname === '/' ? null : 

  return (
    <Navbar bg="dark" variant="light" aria-label="footer">
      <Container className="footer-copyright text-center pb-1 pt-1 footer">
        <Link
          className="text-muted font-size-14 mr-auto underline-hover"
          href="/contactAdmin"
        >
          Contact Us
        </Link>
        <div className="text-muted font-size-14 ml-auto">
          © {new Date().getFullYear()} CampSiter
        </div>
      </Container>
    </Navbar>
  );
}

export default Footer;
