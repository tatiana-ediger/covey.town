import assert from 'assert';
import UserPrefresencesRepository from '../lib/UserPreferencesRepository';

export interface SaveUserRequest {
    /**
     * The email corresponding to the user
     */
    userEmail: string,
    userName: string,
    useAudio: boolean,
    useVideo: boolean,
}

export interface SaveUserResponse {
    userId: string
}

/**
 * Envelope that wraps any response from the server
 */
export interface ResponseEnvelope<T> {
    isOK: boolean;
    message?: string;
    response?: T;
}

export async function saveUserHandler(requestData: SaveUserRequest): Promise<ResposeEnvelope<>> {
    if (requestData.friendlyName.length === 0) {
        return {
            isOK: false,
            message: 'FriendlyName must be specified',
        };
    }
}