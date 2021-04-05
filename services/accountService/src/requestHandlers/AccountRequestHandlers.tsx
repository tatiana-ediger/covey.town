import assert from 'assert';
import { JoinedTown } from '../AccountTypes';
import UserPreferencesRepository from '../lib/UserPreferencesRepository';

/**
 * Payload sent by client to save a user in Covey.Town
 */
export interface SaveUserRequest {
    userEmail: string,
    userName?: string,
    useAudio?: boolean,
    useVideo?: boolean,
}

/**
 * Payload sent by client to request information for a user's email
 */
export interface GetUserRequest {
    userEmail: string,
}

/**
 * Response from the server for a get user request
 */
export interface GetUserResponse {
    userId: string,
    userEmail: string,
    userName: string,
    useAudio: boolean,
    useVideo: boolean,
    visitedServers: JoinedTown[],
}

/**
 * Payload sent by client to delete all information stored for a user
 */
 export interface DeleteUserRequest {
    userEmail: string,
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

export async function saveUserHandler(requestData: SaveUserRequest): Promise<ResponseEnvelope<Record<string, null>>> {
    if (requestData.userEmail.length === 0) {
        return {
            isOK: false,
            message: 'User email must be specified when saving a user',
        };
    }
    const upsertUserResponse = await UserPreferencesRepository.upsertUser();
    const success = upsertUserResponse.success;
    
    return {
        isOK: success,
        message: !success ? `Failed to save user preferences for email: ${requestData.userEmail}` : undefined
      };
    
}

export async function getUserHandler(requestData: GetUserRequest): Promise<ResponseEnvelope<GetUserResponse>> {
    if (requestData.userEmail.length == 0) {
        return {
            isOK: false,
            message: 'User email must be specified when retrieving user details'
        };
    }

    const getUserResponse = await UserPreferencesRepository.getUserInfo(requestData.userEmail);
    const success = getUserResponse.success;

    if (success) {
        return {
            isOK: true,
            response: getUserResponse,
        };
    }
    
    return {
        isOK: false,
        message: `Failed to get user information for email: ${requestData.userEmail}`,
    };
}

export async function deleteUserHandler(requestData: DeleteUserRequest): Promise<ResponseEnvelope<Record<string, null>>> {
    const deleteUser = await UserPreferencesRepository.deleteUser(requestData.userEmail);
    const success = deleteUser.success;
    return {
      isOK: success,
      response: {},
      message: !success ? `Failed to delete user for email: ${requestData.userEmail}` : undefined,
    };
}