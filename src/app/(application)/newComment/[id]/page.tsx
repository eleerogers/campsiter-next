"use client"

import React, { useContext, useEffect, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { toast } from 'react-toastify';
import { Button, Container } from '../../components/bootstrap'
import { LoggedInAsContext } from '../../components/contexts/loggedInAsContext';
import useForm from '../../hooks/useForm';
import useLoading from '../../hooks/useLoading';
import LoadingButton from '../../components/loadingButton';
import StarRating from '../../components/starRating';
import { ICampground, ILoggedInAsContext } from '../../interfaces';

interface PageProps {
  params: { id: string }
}

function NewComment({ params: { id } }: PageProps) {
  const {
    loggedInAs: {
      id: userId,
      admin: adminBool
    }
  } = useContext(LoggedInAsContext) as ILoggedInAsContext;
  const initData = useMemo(() => {
    return {
      rating: 0,
      comment: '',
      userId,
      adminBool,
      avgRating: null
    }
  }, [adminBool, userId]);
  const {
      values,
      handleChange,
      changeRating,
      set
  } = useForm(initData);
  
  useEffect(() => {
    if (initData.userId !== values.userId) {
      set(initData);
    }
  }, [set, initData, values.userId]);

  const searchParams = useSearchParams();
  const campgroundString = searchParams.get('campground') || '';
  let campground: ICampground | null = null;
  if (campgroundString) {
    const decodedString = decodeURIComponent(campgroundString);
    campground = JSON.parse(decodedString);
  }
  const { push, back } = useRouter();
  
  useEffect(() => {
    if (!localStorage.userId) {
      push('/login');
    }
  }, [push]);

  const [loading, setLoadingFalse, setLoadingTrue] = useLoading(false);

  const cancelTokenRef = useRef<CancelTokenSource>();
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }
    }
  }, []);
  
  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    setLoadingTrue();
    const url = `/api/comments/${id}`;
    cancelTokenRef.current = axios.CancelToken.source();
    const cancelToken = cancelTokenRef.current.token;
    try {
      const { data, status } = await axios.post(url, values, { cancelToken });
      if (status === 200) {
        toast.success(data);
        push(`/campgrounds/${id}`)
      }
    } catch (error) {
      const err = error as AxiosError;
      if (axios.isCancel(err)) {
        console.log(`axios call was cancelled`);
      }
      if (err.response?.data) {
        const { response: { data: message } } = err;
        toast.error(`${message}`);
      }
    } finally {
      setLoadingFalse();
    }
  }

  return (
    <div className="comment-padding-top marginBtm">
      <Container>
        <h1 className="text-center color-dark-blue">Review<br /> {campground?.name}</h1>
        <br />
        <form
          className="entryBox centered"
          onSubmit={submitForm}
        >
          <div className="form-group">
            <StarRating
              currRating={values.rating}
              handleChange={changeRating}
              readonly={false}
              className="star-lg m-1"
              divClassName="justify-centered mb-3"
            />
            <textarea
              className="form-control inputTextBox mt-4"
              name="comment"
              placeholder="Comment"
              rows={5}
              onChange={handleChange}
              value={values.comment}
            />
          </div>
          <br />
          <div className="form-group">
            <LoadingButton
              isLoading={loading}
              className="btn-block loading-button btn-orange btn-square"
              variant="primary"
              type="submit"
            >
              Submit
            </LoadingButton>
          </div>
          <Button
            onClick={back}
            size="sm"
            variant="link"
            className="float-left go-back-btn"
          >
            Go Back
          </Button>
        </form>
      </Container>
    </div>
  );
}

export default NewComment;