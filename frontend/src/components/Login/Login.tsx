import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Container, Image } from "@chakra-ui/react"
import { makeStyles, Theme } from '@material-ui/core';
import PreJoinScreens from '../VideoCall/VideoFrontend/components/PreJoinScreens/PreJoinScreens';
import MediaErrorSnackbar
  from '../VideoCall/VideoFrontend/components/PreJoinScreens/MediaErrorSnackbar/MediaErrorSnackbar';
import { TownJoinResponse } from '../../classes/TownsServiceClient';
import { UserInfo } from '../../CoveyTypes';

interface LoginProps {
  doLogin: (initData: TownJoinResponse) => Promise<boolean>
}

export default function Login({ doLogin }: LoginProps): JSX.Element {
  const [mediaError, setMediaError] = useState<Error>();
  /*
    // const loggedOutUser = { userID: '', email: '', username: '', useAudio: false, useVideo: false, maps: []};
    // const [userInfo, setUserInfo] = useState<UserInfo>(loggedOutUser);
    // const [loggedIn, setLoggedIn] = useState<boolean>(false);
    // const auth0 = useAuth0();

    

    // useEffect(() => {
    //   if (loggedIn) {
    //     const userID = auth0.user.sub;
    //     // TODO actually call API
    //     // MOCK API CALL for get RETURNS:
    //     const saveData = { success: true }
    //     const getData = { userID: 'test123', username: 'testuser123', email: 'testuser123@email.com', useAudio: true, useVideo: false, maps: [] }    
    //     setUserInfo({ userID: getData.userID, email: getData.email, username: getData.username, useAudio: getData.useAudio, useVideo: getData.useVideo, maps: getData.maps});
      
    //   }
    //   else {
    //     // set to default value
    //     setUserInfo(loggedOutUser);
    //   }
    // }, [loggedIn]);

    // function Registration(): JSX.Element {  

    //   const classes = useStyles();


    //   if (auth0.isLoading) {
    //       return <div>Authentication Loading ...</div>;
    //   }

    //   if (auth0.isAuthenticated) { 
    //     if (auth0.isAuthenticated !== loggedIn) {
    //       setLoggedIn(auth0.isAuthenticated);
    //     }

    //     return (
    //         <>
    //             <Button onClick={() => auth0.logout({ returnTo: window.location.origin })}>
    //                 Log Out
    //             </Button>
    //             <div className={classes.userProfile}>
    //               <Image
    //                 borderRadius="full"
    //                 boxSize="50px"
    //                 src={auth0.user.picture}
    //               />
    //               { } // <h1>{auth0.user.email}</h1>
    //             </div>
    //         </>
    //     );
    //   }
    
    //   return <Button onClick={async () => { await auth0.loginWithRedirect(); }} >
    //     Log In or Sign Up
    //   </Button>;
    // }
  */
  return (
    <>
      <MediaErrorSnackbar error={mediaError} dismissError={() => setMediaError(undefined)} />
      <PreJoinScreens
        doLogin={doLogin}
        setMediaError={setMediaError}
      />
    </>
  );
}
