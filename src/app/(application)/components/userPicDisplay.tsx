import React, { useContext } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../components/bootstrap'
import { LoggedInAsContext } from './contexts/loggedInAsContext';
import Envelope from 'react-bootstrap-icons/dist/icons/envelope-fill';
import { IUser, ILoggedInAsContext } from '../interfaces';


interface Props {
  author: IUser;
  userId: string;
  userPicLoading: boolean;
  setUserPicLoadingFalse: () => void;
}

function UserPicDisplay({ author, userId, userPicLoading, setUserPicLoadingFalse }: Props) {
  const {
    loggedInAs: {
      id: loggedInAsId,
      admin: loggedInAsAdmin
    }
  } = useContext(LoggedInAsContext) as ILoggedInAsContext;

  function renderContactButton() {
    const authorString = encodeURIComponent(JSON.stringify(author))
    return loggedInAsId !== userId && (
      <Link 
        href={{
          pathname: '/contact',
          query: {
            author: authorString,
          },
        }}
        as='/contact'
      >
        {
          loggedInAsId &&
          <Button
            size="sm"
            variant="outline-info"
            className="ml-2 float-right flex align-items-center"
          >
            <Envelope className="mr-1" />
            {'  '}
            Contact
          </Button>
        }
      </Link>
    )
  }

  function renderEditButton() {
    const authorString = encodeURIComponent(JSON.stringify(author))
    if (
      loggedInAsId === userId
      || loggedInAsAdmin
    ) {
      return (
        <>
          <Link
            href={{
              pathname: '/editUser',
              query: {
                author: authorString
              }
            }}
          >
            <Button
              size="sm"
              variant="warning"
              className="btn-square float-right flex align-items-center"
            >
              Edit
            </Button>
          </Link>
        </>
      );
    }
    return null;
  }

  const {
    first_name: firstName,
    last_name: lastName,
    image,
    email,
    username
  } = author;
  const lNameOrInitial = lastName.length === 1 ? lastName + '.' : lastName;

  return (
    <div
      className={`transition ${userPicLoading ? 'loading' : 'done'}`}
    >
      <h1 className="color-dark-blue user-h1-mobile">{username}</h1>
      {' '}
      <div className="card user-card">
        <Image
          className="card-img-top"
          src={image}
          alt={email}
          onLoad={setUserPicLoadingFalse}
          width={0}
          height={0}
          priority
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
        />
        <div className="card-body">
          <p className="card-text mr-1 display-inline-block">
            {firstName}
            &nbsp;
            {lNameOrInitial}
          </p>
          <div className="float-right flex align-items-center">
            {renderEditButton()}
            {renderContactButton()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPicDisplay;
