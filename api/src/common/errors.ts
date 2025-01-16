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

  public static UnexpectedError = {
    status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    message: 'Unexpected error occurred',
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