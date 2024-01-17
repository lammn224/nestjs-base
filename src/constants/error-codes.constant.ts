// USER
export const BLACKLIST_TOKEN = 'BLACKLIST_TOKEN';
export const USER_NOT_EXIST = 'USER_NOT_EXIST';
export const WRONG_USER_OR_PASSWORD = 'WRONG_USER_OR_PASSWORD';
export const INACTIVE = 'INACTIVE';
export const BLOCKED = 'BLOCKED';

export const ERROR_CODES = new Map<string, string>([
  [BLACKLIST_TOKEN, 'Token is in blacklist (logout, deleted, ...)'],
  [USER_NOT_EXIST, 'User is not exist'],
  [WRONG_USER_OR_PASSWORD, 'User or password login are wrong.'],
  [INACTIVE, 'User account is not active.'],
  [BLOCKED, 'User account is blocked.'],
]);
