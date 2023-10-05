"use client"

import React, { useEffect, useRef, useContext, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from '../components/contexts/loggedInAsContext';
import useForm from '../hooks/useForm';
import useGetFileName from '../hooks/useGetFileName';
import useLoading from '../hooks/useLoading';
import LoadingButton from '../components/loadingButton';
import { ICampground, ILoggedInAsContext } from '../interfaces';


interface IHistory {
  campground: ICampground
}

function EditCampground() {
  const {
    loggedInAs: { admin }
  } = useContext(LoggedInAsContext) as ILoggedInAsContext;

  const searchParams = useSearchParams();
  const campgroundString = searchParams.get('campground') || '';
  let campground = null;
  if (campgroundString) {
    const decodedString = decodeURIComponent(campgroundString);
    campground = JSON.parse(decodedString);
  }

  const {
    push,
    back
  } = useRouter();

  const initBtnMessage = 'Change Campground Image';
  const { imageFile, btnMessage, handleFileChange } = useGetFileName(initBtnMessage);

  const { values, handleChange } = useForm(campground);
  const {
    name,
    image,
    image_id: imageId,
    description,
    price,
    id: campgroundId,
    user_id: userId,
    location
  } = values;

  const [loading, setLoadingFalse, setLoadingTrue] = useLoading(false);

  // so the name at the top of the page doesn't change while you're editing the form:
  const nameRef = useRef(name);

  useEffect(() => {
    if (!localStorage.userId) {
      push('/campgroundsHome');
    }
  }, [push]);

  useEffect(() => {
    if (window.pageYOffset > 115) {
      window.scrollTo(0, 0);
    }
  }, []);

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
    const priceNoDollarSign = price.replace(/\$/gi, '');
    const fd = new FormData();
    cancelTokenRef.current = axios.CancelToken.source()
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      },
      cancelToken: cancelTokenRef.current.token
    };
    if (imageFile) {
      fd.append('image', imageFile);
    } else {
      fd.append('image', image);
    }
    fd.append('imageId', imageId);
    fd.append('name', name);
    fd.append('description', description);
    fd.append('campLocation', location);
    fd.append('price', priceNoDollarSign);
    fd.append('userId', userId);
    // need to check if below still works server side
    fd.append('adminBool', String(admin));
    const url = `/api/campgrounds/${campgroundId}`;

    try {
      const {
        status,
        data: {
          campground: updatedCampground,
          message: putResponseMsg
        }
      } = await axios.put(url, fd, config);
      if (status === 200) {
        toast.success(putResponseMsg);
        push(`/campgrounds/${campgroundId}`)
      } else {
        const error = new Error();
        throw error;
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

  useEffect(() => {
    const customFileUpload = document.getElementById('custom-file-upload');
    const fileUpload = document.getElementById('file-upload');
    customFileUpload?.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        fileUpload?.click();
      }
    })
  }, []);

  return (
    <div className="margin-top-50 marginBtm">
      <Container>
        <h1 className="text-center color-dark-blue">
          Edit Campground:
          <br />
          {nameRef.current}
        </h1>
        <br />
        <form onSubmit={submitForm}>
          <div className="entryBox centered">
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                value={name}
              />
            </div>
            <div className="form-group">
              <textarea
                className="form-control inputTextBox"
                name="description"
                placeholder="Description"
                rows={5}
                onChange={handleChange}
                value={description}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="location"
                placeholder="Location"
                onChange={handleChange}
                value={location}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                name="price"
                placeholder="Price ($/night)"
                onChange={handleChange}
                value={price}
              />
            </div>
            <div className="form-group">
              <label
                id="custom-file-upload"
                htmlFor="file-upload"
                className="btn btn-outline-primary btn-block"
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={0}
              >
                <input
                  id="file-upload"
                  type="file"
                  name="image"
                  data-multiple-caption={btnMessage}
                  onChange={handleFileChange}
                />
                <span>{btnMessage}</span>
              </label>
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
          </div>
        </form>
      </Container>
    </div>
  );
}

export default EditCampground;