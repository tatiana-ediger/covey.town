export type JoinedTown = {
  townID: string;
  positionX: number;
  positionY: number;
};

export type UserInfo = {
  userID: string;
  userEmail: string;
  username: string;
  useAudio: boolean;
  useVideo: boolean;
  towns: JoinedTown[];
};
