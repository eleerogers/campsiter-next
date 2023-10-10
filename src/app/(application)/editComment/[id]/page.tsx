"use client"

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { toast } from 'react-toastify';
import { Button, Container } from '../../components/bootstrap';
import useForm from '../../hooks/useForm';
import useLoading from '../../hooks/useLoading';
import LoadingButton from '../../components/loadingButton';
import StarRating from '../../components/starRating';
import { ICampground, IComment } from '../../interfaces';


interface PageProps {
  params: { id: string },
  searchParams: {
    campground: string,
    loggedInAsAdmin: string,
    commentObj: string
  }
}

function EditComment({ params: { id }, searchParams: { campground: campgroundString, loggedInAsAdmin: loggedInAsAdminString, commentObj: commentObjString } }: PageProps) {
  let campground: ICampground | null = null;
  if (campgroundString) {
    const decodedString = decodeURIComponent(campgroundString);
    campground = JSON.parse(decodedString);
  }
  let adminBool: boolean | null = null;
  if (loggedInAsAdminString) {
    const decodedString = decodeURIComponent(loggedInAsAdminString);
    adminBool = JSON.parse(decodedString);
  }
  let commentObj: IComment = {
    comment_id: NaN,
    user_id: NaN,
    comment: '',
    rating: NaN,
    username: '',
    created_at: ''
  };
  if (commentObjString) {
    const decodedString = decodeURIComponent(commentObjString);
    commentObj = JSON.parse(decodedString);
  }
  const {
    comment_id: commentId,
    user_id: userId,
    comment,
    rating,
  } = commentObj
  
  const { push, back } = useRouter();

  const [loading, setLoadingFalse, setLoadingTrue] = useLoading(false);

  const initFormData = {
    commentId,
    userId,
    campgroundId: id,
    comment,
    user: { id: userId },
    adminBool,
    rating
  };
  const { values, handleChange, changeRating } = useForm(initFormData);

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
    cancelTokenRef.current = axios.CancelToken.source()
    const cancelToken = cancelTokenRef.current.token;
    const url = `/api/comments/${id}`;
    try {
      const { data, status } = await axios.put(url, values, { cancelToken });
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
        <h1 className="text-center color-dark-blue">Edit Review of<br />{campground?.name}</h1>
        <br />
        <form
          className="entryBox centered"
          onSubmit={submitForm}
        >
          <div className="form-group">
            <StarRating
              currRating={values.rating && values.rating}
              handleChange={changeRating}
              readonly={false}
              className="star-lg m-1"
              divClassName="justify-centered mb-3"
            />
            <textarea
              className="form-control inputTextBox"
              name="comment"
              placeholder="Comment"
              rows={5}
              onChange={handleChange}
              value={values.comment || ''}
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

export default EditComment;