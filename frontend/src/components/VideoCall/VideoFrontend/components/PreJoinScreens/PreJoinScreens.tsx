import React, { useEffect, useState } from 'react';
import { Heading, Text } from '@chakra-ui/react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import Registration from '../../../../Login/Registration';
import { TownJoinResponse } from '../../../../../classes/TownsServiceClient';
import TownSelection from '../../../../Login/TownSelection';
import { UserInfo } from '../../../../../CoveyTypes';
import { useAuth0 } from '@auth0/auth0-react';
import { SaveUserRequest } from '../../../../../classes/AccountsServiceClient';
import useCoveyAppState from '../../../../../hooks/useCoveyAppState';

export default function PreJoinScreens(props: { doLogin: (initData: TownJoinResponse) => Promise<boolean>; setMediaError?(error: Error): void }) {
  const auth0 = useAuth0();
  const { accountApiClient } = useCoveyAppState();

  const loggedOutUser = { userID: '', email: '', username: '', useAudio: false, useVideo: false, towns: [] };
  const [loggedIn, setLoggedIn] = useState<boolean>(auth0.isAuthenticated);
  const [userInfo, setUserInfo] = useState<UserInfo>(loggedOutUser);

  if (auth0.isAuthenticated !== loggedIn) {
    setLoggedIn(auth0.isAuthenticated);
  }

  async function updateUserInfo(request: SaveUserRequest) {
    try {
      // const getData = { userID: 'test123', username: 'testuser123', email: 'testuser123@email.com', useAudio: true, useVideo: false, towns: [] };
      await accountApiClient.saveUser(request);
      const getResponse = await accountApiClient.getUser({ userID: request.userID });
      setUserInfo(getResponse as UserInfo);
    } catch (err) {
      console.log('hello??');
      // Do nothing i guess?
    }
  }

  useEffect(() => {
    if (loggedIn) {
      updateUserInfo({ userID: auth0.user.sub, email: auth0.user.email });
    }
    else {
      setUserInfo(loggedOutUser);
    }
  }, [loggedIn]);

  return (
    <IntroContainer>
      <Registration
        auth0={auth0}
      />
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
