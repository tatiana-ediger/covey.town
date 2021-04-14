import { JoinedTown, UserInfo } from '../AccountTypes';
import { getUserByID, upsertUser, SavedUserInfoRequest } from '../lib/UserPreferencesRepository';

/**
 * Payload sent by client to save a user in Covey.Town
 */
export interface SaveUserRequest {
  userID: string;
  email: string;
  username?: string;
  useAudio?: boolean;
  useVideo?: boolean;
  towns?: JoinedTown[];
}

/**
 * Response from the server for a save user request
 */
export interface SaveUserResponse {
  userID: string;
}

/**
 * Payload sent by client to request information for a user's email
 */
export interface GetUserRequest {
  userID: string;
}

/**
 * Response from the server for a get user request
 */
export interface GetUserResponse {
  userID: string;
  email: string;
  username: string;
  useAudio: boolean;
  useVideo: boolean;
  towns: JoinedTown[];
}

/**
 * Payload sent by client to delete all information stored for a user
 */
export interface DeleteUserRequest {
  userEmail: string;
}

/**
 * Envelope that wraps any response from the server
 */
export interface ResponseEnvelope<T> {
  isOK: boolean;
  message?: string;
  response?: T;
}

/**
 * Envelope that wraps any response from the server
 */
export interface ResponseEnvelope<T> {
  isOK: boolean;
  message?: string;
  response?: T;
}

/** AccountService methods:
 *
 * saveUser: add/update user's settings for a useremail (set/update: username, useAudio, useVideo)
 * getUser: retrieve user info (username, useAudio/video, joined servers)
 * deleteUser: remove a user based on their email
 *
 */

export async function saveUserHandler(
  requestData: SaveUserRequest,
): Promise<ResponseEnvelope<Record<string, null>>> {
  if (requestData.email.length === 0) {
    return {
      isOK: false,
      message: 'User email must be specified when saving a user',
    };
  }

  // code to retrieve a user id by calling auth0 api

  const response = await upsertUser(requestData as SavedUserInfoRequest);

  return {
    isOK: response,
    message: !response
      ? `Failed to save user preferences for email: ${requestData.email}`
      : undefined,
  };
}

export async function getUserHandler(
  requestData: GetUserRequest,
): Promise<ResponseEnvelope<GetUserResponse>> {
  if (requestData.userID.length == 0) {
    return {
      isOK: false,
      message: 'User id must be specified when retrieving user details',
    };
  }

  const user = await getUserByID(requestData.userID);

  if (user) {
    return {
      isOK: true,
      response: user as UserInfo,
    };
  }

  return {
    isOK: false,
    message: `Failed to get user information for id: ${requestData.userID}`,
  };
}
