import React from 'react';
import { UserInfo } from '../CoveyTypes';

/**
 * Hint: You will never need to use this directly. Instead, use the
 * `useUserInfo' hook.
 */
const Context = React.createContext<UserInfo | null>(null);

export default Context;
