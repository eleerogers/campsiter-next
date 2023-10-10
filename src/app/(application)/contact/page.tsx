"use client"

import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { toast } from 'react-toastify';
import { Button, Container } from '../components/bootstrap'
import { LoggedInAsContext } from '../components/contexts/loggedInAsContext';
import useForm from '../hooks/useForm';
import useLoading from '../hooks/useLoading';
import LoadingButton from '../components/loadingButton';
import { ILoggedInAsContext } from '../interfaces';


function Contact() {

  const { back } = useRouter()
  const searchParams = useSearchParams();
    const authorString = searchParams.get('author') || '';

    let author = null;
    if (authorString) {
      const decodedString = decodeURIComponent(authorString);
      author = JSON.parse(decodedString);
    }

  const { email, username, first_name, last_name } = author || {}

  const { loggedInAs } = useContext(LoggedInAsContext) as ILoggedInAsContext;
  const emailTo = email || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const usernameTo = username || 'CampSiter';
  const subTitle = first_name && last_name 
  ? <>{first_name} {last_name} will receive your email address<br /> to be able to respond directly</>
  : 'Comments? Questions? Get in touch!';

  const initData = {
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    emailTo,
    usernameTo
  };

  const { values, handleChange, set } = useForm(initData);

  useEffect(() => {
    if (window.pageYOffset > 115) {
      window.scrollTo(0, 0);
    }
  }, []);
  
  useEffect(() => {
    set(loggedInAs);
  }, [loggedInAs, set]);

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
    const url = '/api/users/contact';
    cancelTokenRef.current = axios.CancelToken.source()
    const cancelToken = cancelTokenRef.current.token;
    try {
      const { data: { message }, status } = await axios.post(url, values, { cancelToken });
      if (status === 201) {
        toast.success(message);
        back();
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

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userIdFromLocalStorage = localStorage.getItem('userId');
    if (userIdFromLocalStorage) {
      setUserId(userIdFromLocalStorage);
    }
  }, [setUserId]);

  return (
    <div className="contact-padding-top marginBtm">
      <Container className="color-dark-blue">
        <h1 className="text-center">
          Contact {usernameTo}
        </h1>
        <p className="text-center"><i>
          {subTitle}
        </i></p>
        <br />
        <form
          className="entryBox centered"
          onSubmit={submitForm}
        >
          {!userId &&
            <div className="form-group">
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="Your Email"
                onChange={handleChange}
                value={values.email}
                required
              />
            </div>
          }
          <div className="form-group">
            <textarea
              className="form-control inputTextBox"
              name="message"
              placeholder="Message"
              rows={5}
              onChange={handleChange}
              value={values.message}
              required
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

export default Contact;
