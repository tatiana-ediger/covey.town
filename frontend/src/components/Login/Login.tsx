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

  const LoginButton: React.FunctionComponent = () => {
    const { loginWithRedirect } = useAuth0();
  
    return <Button onClick={() => loginWithRedirect()}>Log In</Button>;
  };
  
  return (
    <>
      <LoginButton/>
      <MediaErrorSnackbar error={mediaError} dismissError={() => setMediaError(undefined)} />
      <PreJoinScreens
        doLogin={doLogin}
        setMediaError={setMediaError}
      />
    </>
  );
}
