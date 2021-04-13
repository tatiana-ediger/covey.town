export type JoinedTown = {
  townID: string;
  positionX: number;
  positionY: number;
};

export type UserInfo = {
  userID: string;
  username: string;
  userEmail: string;
  useAudio: boolean;
  useVideo: boolean;
  towns: JoinedTown[];
};
