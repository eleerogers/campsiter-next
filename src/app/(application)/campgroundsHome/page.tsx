"use client"

import React, {
  useState, useEffect, useCallback, useRef
} from 'react';
import { Button, Jumbotron, Container, Row, Col, Spinner, Pagination } from '@/app/(application)/components/imports/bootstrap'
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { toast } from 'react-toastify';
import usePagination from '../hooks/usePagination';
import useSearchFilter from '../hooks/useSearchFilter';
import useGetCGs from '../hooks/useGetCGs';
import useSort from '../hooks/useSort';
import SortDropdown from '../components/sortDropdown';
import debounce from '../utils/debounce';
import CampgroundThumbs from '../components/campgroundThumbs';


function Page() {
  const [sortStyle, setSortStyle] = useState<string>('Recent');
  const [search, setSearch] = useState('');
  const { data: { campgrounds }, errMsg, isLoading } = useGetCGs();
  const filteredCGs = useSearchFilter(search, campgrounds);
  const sortedCGs = useSort(sortStyle, filteredCGs);
  const CAMPGROUNDS_PER_PAGE = 12;

  const [jumboOffsetHt, setJumboOffsetHt] = useState(0);
  const jumbotronRef = useRef<HTMLDivElement | null>(null);

  const {
    jump, currentData, currentPage, maxPage
  } = usePagination(sortedCGs, CAMPGROUNDS_PER_PAGE, jumboOffsetHt);
  const thisPageCGs = currentData();
  const jumpRef = useRef(jump);
  useEffect(() => {
    jumpRef.current = jump;
  }, [jump]);
  const jumpCallback = useCallback(() => { jumpRef.current(1); }, [jumpRef])

  const [windowWidth, setWindowWidth] = useState(0);
  const resizeWindow = () => {
    setWindowWidth(window.innerWidth);
  };
  const debouncedResizeWindow = debounce(resizeWindow, 500);
  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", debouncedResizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, [debouncedResizeWindow]);

  useEffect(() => {
    setJumboOffsetHt(jumbotronRef.current?.offsetHeight ?? 0)
  }, [windowWidth, jumbotronRef]);

  const pages = [];
  for (let number = 1; number <= maxPage; number += 1) {
    pages.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => jump(number)}
      >
        {number}
      </Pagination.Item>,
    );
  }
  const paginationDisplay = pages.length > 1
    && (
      <div>
        <Pagination className="center-div pagination">
          {pages}
        </Pagination>
      </div>
    );

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setSearch(e.target.value);
    if (pages.length) {
      jump(1);
    }
  }

  useEffect(() => {
    if (pages.length) {
      jumpCallback();
    }
  }, [sortStyle, pages.length, jumpCallback]);

  const pathname = usePathname()

  useEffect(() => {
    setTimeout(() => {
      if (window.innerWidth < 576 && window.scrollY > 0) {
        window.scrollTo(0, 0);
      } else if (window.scrollY > 115 && window.scrollY < 442) {
        window.scrollTo(0, 115);
      }
    }, 0);
  }, [pathname, jumboOffsetHt]);

  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg);
    }
  }, [errMsg]);

  const campgroundsDisplayConfig = {
    sm: 6,
    md: 4,
    lg: 3,
    colClass: 'mb-4',
    campClass: 'campgroundThumb'
  };

  const spinnerStyle = isLoading ? { left: '50%' } : { display: 'none' };

  return (
    <div>
      <Container>
        <Container>
          <Jumbotron ref={jumbotronRef}>
            <h1>Welcome to CampSiter!</h1>
            <p>Post and review campsites <br className="brnodisplay" />from around the globe</p>
            <Link href="/newCampground">
              <Button
                variant="primary"
                size="lg"
                className="btn-orange btn-square mt-3 mb-1"
              >
                Add New Campground
              </Button>
            </Link>
            <br />
            <br />
            <form
              className="display-flex"
              onSubmit={(e) => { e.preventDefault(); }}
            >
              <input
                className="form-control search-form mt-1 input"
                id="main-searchbar"
                type="text"
                name="search"
                placeholder="Search campgrounds..."
                value={search}
                onChange={handleSearchChange}
                autoComplete="off"
                aria-label="Search campgrounds"
              />
            </form>
            <SortDropdown
              value={sortStyle}
              setValue={setSortStyle}
            />
          </Jumbotron>
        </Container>
        <Container className="text-align-center min-height-50vh">
          <Row
            style={spinnerStyle}
            key={1}
          >
            <Col
              style={{
                top: '5em'
              }}
            >
              <Spinner
                animation="border"
                variant="primary"
              />
            </Col>
          </Row>
          <Row
            key={2}
            style={{
              'minWidth': '296px'
            }}
          >
            <CampgroundThumbs
              campgrounds={thisPageCGs}
              configObj={campgroundsDisplayConfig}
            />
          </Row>
        </Container>
        {paginationDisplay}
      </Container>
    </div>
  );
}

export default Page;
