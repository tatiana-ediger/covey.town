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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const LoginButton: React.FunctionComponent = () => {
    const { isAuthenticated, loginWithRedirect } = useAuth0();
  
    return <Button 
      onClick={async () => {
        await loginWithRedirect();
        setIsLoggedIn(isAuthenticated);
      }}>
        Log In or Sign Up
    </Button>;
  };
  const LogoutButton: React.FunctionComponent = () => {
    const { logout } = useAuth0();
  
    return (
      <Button onClick={() => logout({ returnTo: window.location.origin })}>
        Log Out
      </Button>
    );
  };
  
  return (
    <>
      <LoginButton/>
      <LogoutButton/>
      <MediaErrorSnackbar error={mediaError} dismissError={() => setMediaError(undefined)} />
      <PreJoinScreens
        isLoggedIn={isLoggedIn}
        doLogin={doLogin}
        setMediaError={setMediaError}
      />
    </>
  );
}
