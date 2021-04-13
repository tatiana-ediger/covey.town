export type JoinedTown = { townId: string; positionX: number; positionY: number };

export type User = {
  userEmail: string;
  username: string;
  servers: JoinedTown[];
  useAudio: boolean;
  useVideo: boolean;
};

/**
 * From login, email
 * From Auth0 api we get a userID
 * From database, we get a userID ?? how do we generate this?
 */

/**
 * TownJoinRequest ->s
 *
 */
