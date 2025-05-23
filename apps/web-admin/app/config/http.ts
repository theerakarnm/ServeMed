export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HTTP_STATUS = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
export type HTTP_STATUS_CODE = keyof typeof HTTP_STATUS;
export type HTTP_STATUS_MESSAGE = {
  [key in HTTP_STATUS_CODE]: string;
};
export const HTTP_STATUS_MESSAGE: HTTP_STATUS_MESSAGE = {
  OK: 'OK',
  CREATED: 'Created',
  ACCEPTED: 'Accepted',
  NO_CONTENT: 'No Content',
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not Found',
  METHOD_NOT_ALLOWED: 'Method Not Allowed',
  CONFLICT: 'Conflict',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  SERVICE_UNAVAILABLE: 'Service Unavailable',
} as const;
export type HTTP_STATUS_MESSAGE_CODE = keyof typeof HTTP_STATUS_MESSAGE;
export type HTTP_STATUS_MESSAGE_VALUE = typeof HTTP_STATUS_MESSAGE[HTTP_STATUS_MESSAGE_CODE];
export type HTTP_STATUS_MESSAGE_TYPE = {
  [key in HTTP_STATUS]: HTTP_STATUS_MESSAGE_VALUE;
};
export const HTTP_STATUS_MESSAGE_TYPE: HTTP_STATUS_MESSAGE_TYPE = {
  [HTTP_STATUS.OK]: HTTP_STATUS_MESSAGE.OK,
  [HTTP_STATUS.CREATED]: HTTP_STATUS_MESSAGE.CREATED,
  [HTTP_STATUS.ACCEPTED]: HTTP_STATUS_MESSAGE.ACCEPTED,
  [HTTP_STATUS.NO_CONTENT]: HTTP_STATUS_MESSAGE.NO_CONTENT,
  [HTTP_STATUS.BAD_REQUEST]: HTTP_STATUS_MESSAGE.BAD_REQUEST,
  [HTTP_STATUS.UNAUTHORIZED]: HTTP_STATUS_MESSAGE.UNAUTHORIZED,
  [HTTP_STATUS.FORBIDDEN]: HTTP_STATUS_MESSAGE.FORBIDDEN,
  [HTTP_STATUS.NOT_FOUND]: HTTP_STATUS_MESSAGE.NOT_FOUND,
  [HTTP_STATUS.METHOD_NOT_ALLOWED]: HTTP_STATUS_MESSAGE.METHOD_NOT_ALLOWED,
  [HTTP_STATUS.CONFLICT]: HTTP_STATUS_MESSAGE.CONFLICT,
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: HTTP_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
  [HTTP_STATUS.SERVICE_UNAVAILABLE]: HTTP_STATUS_MESSAGE.SERVICE_UNAVAILABLE,
} as const;
