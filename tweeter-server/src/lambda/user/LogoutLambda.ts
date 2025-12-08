import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AuthorizationService } from "../../model/service/AuthorizationService";

export const handler = async (
  request: LogoutRequest
): Promise<LogoutResponse> => {
  try {
    const authService = new AuthorizationService();
    await authService.authorize(request.token);

    const userService = new UserService();
    const authToken: string = request.token;

    await userService.logout(authToken);

    return {
      success: true,
      message: "User logged out successfully",
    };
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("unauthorized:")) {
      // Already expired / not authenticated -> treat as success
      return {
        success: true,
        message: "User logged out successfully",
      };
    }
    throw e;
  }
};
