import HttpStatusCodes from '@src/common/HttpStatusCodes';
import RouteError from '@src/common/RouteError';

class ErrorsUtil {
  public static Unauthorized = {
    status: HttpStatusCodes.UNAUTHORIZED,
    message: 'Unauthorized',
  };

  public static InvalidUserDetails = {
    status: HttpStatusCodes.UNAUTHORIZED,
    message: 'Invalid user details',
  };

  public static InvalidToken = {
    status: HttpStatusCodes.FORBIDDEN,
    message: 'Invalid token',
  };

  public static UnexpectedError = {
    status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    message: 'Unexpected error occurred',
  };

  public static FieldAlreadyExists = (field: string, value: string) => ({
    status: HttpStatusCodes.CONFLICT,
    message: `${field} "${value}" already exists`,
  });

  public static UserNotFound = {
    status: HttpStatusCodes.NOT_FOUND,
    message: 'User not found',
  };

  public static PostLikeFailed = {
    status: HttpStatusCodes.BAD_REQUEST,
    message: 'Failed to like post',
  };

  public static getError(error: unknown) {
    if (!(error instanceof RouteError)) {
      return this.UnexpectedError;
    }

    return {
      status: error.status,
      message: error.message,
    };
  }
}

export default ErrorsUtil;
