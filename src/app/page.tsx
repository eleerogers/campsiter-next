import Link from 'next/link';
import { Button } from '@/app/(application)/components/imports/bootstrap';


function Landing() {

  return (
    <div className="landing-outer">
      <div className="landing-header">
        <h1>Welcome to CampSiter!</h1>
        <br />
        <br />
        <ul>
          <Link href="/campgroundsHome">
            <Button
              className="box-shadow"
              variant="info"
            >
              Get Started
            </Button>
          </Link>
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
