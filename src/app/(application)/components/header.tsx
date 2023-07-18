import { Nav, Navbar, Container, Button, Col } from './bootstrap'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useLoggedInAsContext } from './contexts/loggedInAsContext';
import { ILoggedInAsContext } from '../interfaces';


function Header() {
  const {
    logoutUser,
    loggedInAs: {
      id,
      username
    }
  } = useLoggedInAsContext() as ILoggedInAsContext;
  // const {
  //   location: {
  //     pathname
  //   },
  //   push
  // } = useHistory();

  const { push } = useRouter()
  const pathname = usePathname()

  function logout(path: string) {
    logoutUser(path, push);
  }

  const showLoginOrLoggedInAs = username.length > 0
    ? (
      <div className="flex">
        <Link
          className="nav-link padding-auto-0 dissapear-small"
          href="/contactAdmin"
        >
          Contact
        </Link>
        <Link href={`/ycusers/${id}`}>
          <div className="nav-link-custom padding-auto-0 min-width-125">
            Logged in as
            {' '}
              <span className="text-primary font-weight-500" 
              >
                {username}
              </span>
          </div>
        </Link>
        <Button
          size="sm"
          className="float-right btn-max-ht btn-square ml-2 logout-btn"
          onClick={() => logout(pathname)}
        >
          Logout
        </Button>
      </div>
    )
    : (
      <div className="flex">
        <Link
          className="nav-link padding-auto-0 dissapear-small"
          href="/contactAdmin"
        >
          Contact
        </Link>
        <Link
          className="nav-link padding-auto-0"
          href="/login"
        >
          Login
        </Link>
        <Link
          className="nav-link padding-auto-0"
          href="/signup"
        >
          Signup
        </Link>
      </div>
    );

  return (
    <Navbar className={`mb-3 navMinHeight background-beige ${pathname === '/campgroundsHome' && 'navbar-styles'}`} bg="light" variant="light" aria-label="header">
      <Container className="d-flex justify-content-between">
        <Col className="min-width-col">
          <Link href="/campgroundsHome">
            <Image className="limit-pic-size" alt="Campsiter logo" src="https://res.cloudinary.com/eleerogers/image/upload/v1593126696/noun_camping_location_710490_srkfky.png" />
            <Navbar.Brand className="color-dark-blue">CampSiter</Navbar.Brand>
          </Link>
        </Col>

        <Col>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              {showLoginOrLoggedInAs}
            </Nav>
          </Navbar.Collapse>
        </Col>
      </Container>
    </Navbar>
  );
}

export default Header;
