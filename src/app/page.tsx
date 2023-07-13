import Link from 'next/link';
import { Button } from '@/app/components/bootstrap';
import './bootstrap.colors.css'


function Landing() {

  return (
    <div className="landing-outer">
      <div className="landing-header">
        <h1>Welcome to CampSiter!</h1>
        <br />
        <br />
        <ul>
          <Button
            as={Link}
            className="box-shadow"
            variant="info"
            href="/campgroundsHome"
          >
            Get Started
          </Button>
        </ul>
      </div>
      <ul className="slideshow">
        <li />
        <li />
        <li />
        <li />
        <li />
      </ul>
    </div>
  );
}

export default Landing;
