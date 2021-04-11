import React, { useEffect, useState } from 'react';
import { Button, Heading, Image, Text } from '@chakra-ui/react';
import { makeStyles, Theme } from '@material-ui/core';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import { TownJoinResponse } from '../../../../../classes/TownsServiceClient';
import TownSelection from '../../../../Login/TownSelection';
import { UserInfo } from '../../../../../CoveyTypes';
import { useAuth0 } from '@auth0/auth0-react';

const useStyles = makeStyles((theme: Theme) => ({
  userProfile: {
    float: 'right',
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

export default function PreJoinScreens(props: { doLogin: (initData: TownJoinResponse) => Promise<boolean>; setMediaError?(error: Error): void }) {
  const loggedOutUser = { userID: '', email: '', username: '', useAudio: false, useVideo: false, maps: []};
  const [userInfo, setUserInfo] = useState<UserInfo>(loggedOutUser);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const auth0 = useAuth0();

  

  useEffect(() => {
    if (loggedIn) {
      const userID = auth0.user.sub;
      // TODO actually call API
      // MOCK API CALL for get RETURNS:
      const saveData = { success: true }
      const getData = { userID: 'test123', username: 'testuser123', email: 'testuser123@email.com', useAudio: true, useVideo: false, maps: [] }    
      setUserInfo({ userID: getData.userID, email: getData.email, username: getData.username, useAudio: getData.useAudio, useVideo: getData.useVideo, maps: getData.maps});
    
    }
    else {
      // set to default value
      setUserInfo(loggedOutUser);
    }
  }, [loggedIn]);

  function Registration(): JSX.Element {  

    const classes = useStyles();


    if (auth0.isLoading) {
        return <div>Authentication Loading ...</div>;
    }

    if (auth0.isAuthenticated) { 
      if (auth0.isAuthenticated !== loggedIn) {
        setLoggedIn(auth0.isAuthenticated);
      }

      return (
          <>
              <Button onClick={() => auth0.logout({ returnTo: window.location.origin })}>
                  Log Out
              </Button>
              <div className={classes.userProfile}>
                <Image
                  borderRadius="full"
                  boxSize="50px"
                  src={auth0.user.picture}
                  title={auth0.user.email}
                />
                {/* <h1>{auth0.user.email}</h1> */}
              </div>
          </>
      );
    }
  
    return <Button onClick={async () => { await auth0.loginWithRedirect(); }} >
      Log In or Sign Up
    </Button>;
  }
  
  return (
    <IntroContainer>
      <Registration />
      <Heading as="h2" size="xl">Welcome to Covey.Town{userInfo.username ? `, ${userInfo.username}` : ''}!</Heading>
      <Text p="4">
        Covey.Town is a social platform that integrates a 2D game-like metaphor with video chat.
        To get started, setup your camera and microphone, choose a username, and then create a new town
        to hang out in, or join an existing one.
      </Text>
      <DeviceSelectionScreen 
        useAudio={userInfo.useAudio}
        useVideo={userInfo.useVideo}
        setMediaError={props.setMediaError} 
        />
      <TownSelection 
        username={userInfo.username}
        doLogin={props.doLogin} />
    </IntroContainer>
  );
}
