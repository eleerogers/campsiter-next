"use client"

import React, { useState, useEffect, useContext, ReactNode, useRef } from 'react';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import { toast } from 'react-toastify';
import { IUserCamelCase, ILoggedInAsContext } from '../../interfaces';


const loggedInAsInit: IUserCamelCase = {
  id: '',
  password: '',
  email: '',
  createdAt: '',
  admin: false,
  image: '',
  imageId: '',
  firstName: '',
  lastName: '',
  username: ''
};

interface Props {
  children?: ReactNode;
}

const LoggedInAsContext = React.createContext<ILoggedInAsContext | null>(null);

function LoggedInAsContextProvider({ children }: Props) {
  const [loggedInAs, setLoggedInAs] = useState(loggedInAsInit);
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const source = axios.CancelToken.source();
        cancelTokenRef.current = source;

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${localStorage.userId}`, {
          cancelToken: source.token,
        });

        const {
          admin,
          created_at: createdAt,
          email,
          first_name: firstName,
          last_name: lastName,
          id,
          image,
          image_id: imageId,
          password,
          username
        } = response.data.user;

        const updatedLoggedInAs: IUserCamelCase = {
          admin,
          createdAt,
          email,
          firstName,
          lastName,
          id,
          image,
          imageId,
          password,
          username
        };

        setLoggedInAs(updatedLoggedInAs);
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
    };
    if (localStorage.userId) {
      fetchUser();
    }

    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }
    };
  }, []);

  async function logoutUser(path: string, push: (route: string) => void) {
    try {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Logout request canceled.');
      }

      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/logout`, {withCredentials: true});
      localStorage.removeItem('userId');
      setLoggedInAs(loggedInAsInit);

      const pathArr = path.split('/');
      const pathLast = pathArr.pop();
      if (
        pathLast === 'new' ||
        pathLast === 'edit' ||
        pathLast === 'newCampground' ||
        pathLast === 'editCampground'
      ) {
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

  return (
    <LoggedInAsContext.Provider
      value={{ loggedInAs, setLoggedInAs, logoutUser }}
    >
      {children}
    </LoggedInAsContext.Provider>
  );
}

const useLoggedInAsContext = (): ILoggedInAsContext => {
  const context = useContext(LoggedInAsContext);
  if (!context) {
    throw new Error('useLoggedInAsContext must be used within a LoggedInAsContextProvider');
  }
  return context;
};

export { LoggedInAsContextProvider, LoggedInAsContext, useLoggedInAsContext };
