"use client"

import React, { useEffect, useContext, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { toast } from 'react-toastify';
import { LoggedInAsContext } from '../components/contexts/loggedInAsContext';
import useForm from '../hooks/useForm';
import useLoading from '../hooks/useLoading';
import LoadingButton from '../components/loadingButton';
import { ILoggedInAsContext } from '../interfaces';


function Login() {
  const loginInit = {
    emailForm: '',
    passwordForm: '',
  };
  const {
    handleChange: loginFormHandleChange,
    values: {
      emailForm,
      passwordForm
    }
  } = useForm(loginInit);

  // const {
  //   length
  // } = useHistory();
  const { push, back } = useRouter()
  const { loggedInAs, setLoggedInAs } = useContext(LoggedInAsContext) as ILoggedInAsContext;

  const [loading, setLoadingFalse, setLoadingTrue] = useLoading(false);

  useEffect(() => {
    if (loggedInAs.id.length > 0) {
      push('/campgroundsHome');
    }
  }, [loggedInAs, push]);

  // // after doing a password reset this prevents
  // // sending you back to the 'enter new password page'
  // // after pressing the 'go back' link
  // function goBackOrToCampgrounds() {
  //   if (length > 2) {
  //     back();
  //   } else {
  //     push('/campgroundsHome');
  //   }
  // }

  const cancelTokenRef = useRef<CancelTokenSource>();
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }
    }
  }, []);
  
  async function submitLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoadingTrue();
    cancelTokenRef.current = axios.CancelToken.source();
    const cancelToken = cancelTokenRef.current.token;
    try {
      const loginInfo = {
        email: emailForm,
        password: passwordForm
      };
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/login/`, loginInfo, { cancelToken, withCredentials: true });
      localStorage.userId = data.id;
      setLoggedInAs(data);
      back();
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
    <div className="margin-top-50">
      <Container>
        <h1 className="text-center color-dark-blue">Login to your account</h1>
        <p className="text-center color-dark-blue"><i>Don&apos;t have an account? <Link className="font-weight-500 color-cornflower-blue" href="/signup">Signup!</Link></i></p>
        <br />
        <form
          className="entryBox centered"
          onSubmit={submitLogin}
        >
          <div className="form-group">
            <input
              className="form-control"
              type="email"
              name="emailForm"
              placeholder="Email"
              value={emailForm}
              onChange={loginFormHandleChange}
            />
          </div>
          <div className="form-group mb-1">
            <input
              className="form-control"
              type="password"
              name="passwordForm"
              placeholder="Password"
              value={passwordForm}
              onChange={loginFormHandleChange}
            />
          </div>
          <Link href="/forgot">
            <Button className="go-back-btn" size="sm" variant="link">Forgot Password</Button>
          </Link>
          <br />
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
            className="float-left marginBtm go-back-btn"
            size="sm"
            variant="link"
          >
            Go Back
          </Button>
        </form>
      </Container>
    </div>
  );
}

export default Login;
