import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from "@chakra-ui/react"
import PreJoinScreens from '../VideoCall/VideoFrontend/components/PreJoinScreens/PreJoinScreens';
import MediaErrorSnackbar
  from '../VideoCall/VideoFrontend/components/PreJoinScreens/MediaErrorSnackbar/MediaErrorSnackbar';
import { TownJoinResponse } from '../../classes/TownsServiceClient';

interface LoginProps {
  doLogin: (initData: TownJoinResponse) => Promise<boolean>
}


export default function Login({ doLogin }: LoginProps): JSX.Element {
  const [mediaError, setMediaError] = useState<Error>();
  const [userEmail, setUserEmail] = useState<string>('');

  const LoginButton: React.FunctionComponent = () => {
    const { loginWithRedirect } = useAuth0();

    return <Button 
      onClick={async () => { 
          await loginWithRedirect();
        }} >
      Log In or Sign Up
    </Button>;
  };
  const LogoutButton: React.FunctionComponent = () => {
    const { logout } = useAuth0();

    return (
      <Button onClick={() => {
          logout({ returnTo: window.location.origin });
        }} >
        Log Out
      </Button>
    );
  };

  interface UserProps {
    picture: string,
    name: string,
    email: string
  }

  function ProfilePage({ picture, name, email }: UserProps): JSX.Element {  
    return (
      <div>
        <img src={picture} alt={name} />
        <h2>Name: {name}</h2>
        <p>Email: {email}</p> 
      </div>
    );
  };

  const RegistrationComponent: React.FunctionComponent = () => {
    const auth0 = useAuth0();

    if (auth0.isLoading) {
      return <div>Loading ...</div>;
    }

    if (auth0.isAuthenticated) {
      setUserEmail(auth0.user.email ?? '');
      return (
        <>
          <LogoutButton/>
          <ProfilePage
            picture={auth0.user.picture as string}
            name={auth0.user.name as string}
            email={auth0.user.email as string} 
          />
        </>
      )
    }
    setUserEmail('');
    return <LoginButton/>
  }
  
  return (
    <>
      <RegistrationComponent/>
      <MediaErrorSnackbar error={mediaError} dismissError={() => setMediaError(undefined)} />
      <PreJoinScreens
        userEmail={userEmail}
        doLogin={doLogin}
        setMediaError={setMediaError}
      />
    </>
  );
}
