"use client"

import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Col, Container, Row, Spinner } from '../../components/imports/bootstrap'
import useGetCGs from '../../hooks/useGetCGs';
import useLoading from '../../hooks/useLoading';
import Campgrounds from '../../components/campgroundThumbs';
import UserPicDisplay from '../../components/userPicDisplay'; 

interface PageProps {
  params: { userId: string }
}

function UserProfile({ params: { userId } }: PageProps) {
  const { data: { campgrounds, user: author }, errMsg, isLoading } = useGetCGs(`/api/campgrounds/user/${userId}`);
  const [userPicLoading, setUserPicLoadingFalse] = useLoading();
  
  const campgroundsDisplayConfig = {
    campClass: 'campgroundUserThumb',
    colClass: 'mb-4',
    sm: 12,
    md: 6,
    lg: 4
  };

  const spinnerStyle = isLoading ? { left: '50%' } : { display: 'none' };
  const loadedDisplay = isLoading || userPicLoading ? { display: 'none' } : {};

  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg);
    }
  }, [errMsg]);

  useEffect(() => {
    if (window.scrollY > 115) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="row" style={{"minWidth": "296px"}}>
      <Container>
        <Row
          style={spinnerStyle}
          key={1}
        >
          <Col
            style={{
              textAlign: 'center',
              top: '5em'
            }}
          >
            <Spinner
              animation="border"
              variant="primary"
            />
          </Col>
        </Row>
      </Container>
      <div
        className="col-md-4"
        style={loadedDisplay}
      >
        { author.first_name.length > 0 && (
          <UserPicDisplay
            userId={userId}
            author={author}
            userPicLoading={userPicLoading}
            setUserPicLoadingFalse={setUserPicLoadingFalse}
          />
        )}
      </div>
      <div style={loadedDisplay} className={'user-cg-box col-md-8 border-top-mobile'}>
        <Container className="text-align-center">
          <Row key={2} style={loadedDisplay}>
            <Campgrounds
              campgrounds={campgrounds}
              configObj={campgroundsDisplayConfig}
            />
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default UserProfile;
