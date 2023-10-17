"use client"

import React, { useContext, useState, useEffect, useRef } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button, Col, Container, Row, Spinner } from '../../components/imports/bootstrap'
import moment from 'moment-mini';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from '../../components/contexts/loggedInAsContext';
import MapContainer from '../../components/map';
import DeleteModal from '../../components/deleteModal';
import useLoading from '../../hooks/useLoading';
import useGetCGs from '../../hooks/useGetCGs';
import Comments from '../../components/comments';
import useGetAndDeleteComments from '../../hooks/useGetAndDeleteComments';
import StarRating from '../../components/starRating';
import { ICampground, ILoggedInAsContext } from '../../interfaces';


interface PageProps {
  params: { id: string }
}

function CampgroundPage({ params: { id } }: PageProps) {
  const emptyCGObj: ICampground = {
    id: 0,
    user_id: '',
    image_id: '',
    name: '',
    image: '',
    description: '',
    price: '',
    created_at: '',
    username: '',
    rating: '',
    lat: 0,
    lng: 0,
    location: '',
  };
  const {
    push,
  } = useRouter();

  const fetchCGUrl = `/api/campgrounds/${id}`;
  const {
    data: { campground },
    isLoading: cgIsLoading, errMsg
  } = useGetCGs(fetchCGUrl, emptyCGObj);
  const [comments, deleteComment, currAvgRating] = useGetAndDeleteComments(campground);
  
  const [loading, setLoadingFalse] = useLoading();
  const [hasAlreadyReviewed, setHasAlreadyReviewed] = useState(false);
  const [numRatings, setNumRatings] = useState(0);

  useEffect(() => {
    // How many star ratings are there
    const nRatings = comments.reduce((a, b) => {
      return b.rating && b.rating > 0 ? a + 1 : a;
    }, 0)
    if (nRatings !== numRatings) {
      setNumRatings(nRatings);
    }
  }, [comments, numRatings])

  const {
    loggedInAs: {
      id: loggedInAsId,
      admin: loggedInAsAdmin
    }
  } = useContext(LoggedInAsContext) as ILoggedInAsContext;

  useEffect(() => {
    // determine if user has already reviewed this site
    const alreadyReviewed = comments.some(comment => {
      return comment.user_id === Number(loggedInAsId);
    });
    setHasAlreadyReviewed(alreadyReviewed);
  }, [comments, loggedInAsId]);  

  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg);
    }
  }, [errMsg]);

  useEffect(() => {
    if (window.pageYOffset > 115) {
      window.scrollTo(0, 0);
    }
  }, []);

  const {
    id: campgroundId,
    user_id: userId,
    image_id: imageId,
    name,
    image,
    description,
    price,
    created_at: createdAt,
    username: authorUsername,
    lat,
    lng
  } = campground;

  const cancelTokenRef = useRef<CancelTokenSource>();
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }
    }
  }, []);
  
  async function deleteCampgroundAndRedirect() {
    cancelTokenRef.current = axios.CancelToken.source()
    try {
      const delUrl = `/api/campgrounds/${campgroundId}`;
      const data = {
        adminBool: loggedInAsAdmin,
        userId,
        imageId,
        delete: true
      };
      const cancelToken = cancelTokenRef.current.token;
      const {
        status,
        data: message
      } = await axios.delete(delUrl, { data, cancelToken });

      if (status === 200) {
        toast.success(message);
        push('/campgroundsHome');
      }
    } catch (error) {
      const err = error as AxiosError
      if (axios.isCancel(err)) {
        console.log(`axios call was cancelled`);
      }
      if (err.response?.data) {
        const { response: { data: message } } = err;
        toast.error(`${message}`);
      }
    }
  }

  const campgroundString = encodeURIComponent(JSON.stringify(campground))
  
  function renderEditDeleteBtns() {
    if (
      loggedInAsId === String(userId)
      || loggedInAsAdmin
    ) {
      return (
        <>
          <Link href={{
            pathname: `/editCampground/${id}`,
            query: {
              campground: campgroundString
            }
          }}
          >
            <Button
              size="sm"
              variant="warning"
              className="mr-2 btn-square"
            >
              Edit
            </Button>
          </Link>
          <DeleteModal
            itemType="campground"
            itemObj={campground}
            handleDelete={deleteCampgroundAndRedirect}
            loggedInAsAdminBool={loggedInAsAdmin}
          >
            Delete
          </DeleteModal>
        </>
      );
    }
    return null;
  }

  const spinnerStyle = loading
    ? {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
    : { display: 'none' };

  return (
    <div>
      <div className="row flex-dir-col-rev">
        <div className="col-md-3">
          <div className="map col-md-12 d-flex d-md-block">
            <MapContainer
              lat={lat}
              lng={lng}
            />
          </div>
        </div>
        <div className="col-md-9">
          <div className="card mb-3">
            <div className="test-div">
              <div
                style={{ display: 'flex' }}
                className="test-image"
              >
                <Container
                  className="d-flex justify-content-center"
                >
                  <Row
                    style={spinnerStyle}
                    key={1}
                  >
                    <Col
                      style={{
                        textAlign: 'center',
                      }}
                    >
                      <Spinner
                        animation="border"
                        variant="primary"
                      />
                    </Col>
                  </Row>
                </Container>
              </div>
            {  image && <Image
                className={`test-image img-responsive cover transition ${loading ? 'loading' : 'done'}`}
                alt={name}
                src={image}
                onLoad={setLoadingFalse}
                width={0}
                height={0}
                priority
                sizes="100vw"
                style={{ width: '100%', height: 'auto' }}
              /> }
            </div>
            <div className="card-body cg-card-body">
              { !cgIsLoading && <div>
              <h6 className="float-right">
                $
                {price}
                /night
              </h6>
              <h4 className="color-dark-blue">
                {name}
              </h4>
              <p className="keepTextSpacing">{description}</p>
              <p>
                <em>
                  Submitted by:
                  {' '}
                  <Link className="text-primary font-weight-600" href={`/user/${userId}`}>
                    {authorUsername}
                  </Link>
                  {' '}
                  {moment(createdAt).fromNow()}
                </em>
              </p>
              {renderEditDeleteBtns()}
              </div> }
            </div>
          </div>
          <div className="card card-body bg-light mb-3">
            <div className="flex space-between">
                <div className="float-left">
                  {
                    numRatings > 0 &&
                    <div>
                      <StarRating
                        currRating={+currAvgRating}
                        readonly={true}
                        className="star-cg-avg"
                        divClassName="mb-2"
                        numRatings={numRatings}
                      />
                      <p>Current campground rating: <b>{currAvgRating}</b></p>
                    </div>
                  }
                </div>
              <span className="text-right float-right">
              { 
                !hasAlreadyReviewed &&
                <Link href={{
                  pathname: `/newComment/${campgroundId}`,
                  query: {
                    campground: campgroundString,
                  }
                }}
                >
                  <Button
                    size="sm"
                    className="btn-square ml-2 min-width-134"
                    variant="success"
                  >
                    Rate/Review
                  </Button>
                </Link>
              }
              </span>
            </div>
            <hr />
            <div className="row">
              <Comments
                campground={campground}
                comments={comments}
                deleteComment={deleteComment}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampgroundPage;
