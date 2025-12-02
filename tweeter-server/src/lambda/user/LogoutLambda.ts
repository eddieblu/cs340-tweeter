import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AuthorizationService } from "../../model/service/AuthorizationService";

export const handler = async (
  request: LogoutRequest
): Promise<LogoutResponse> => {
  const authService = new AuthorizationService();
  await authService.authorize(request.token);

  const userService = new UserService();

  const authToken: string = request.token;

  await userService.logout(authToken);

  return {
    success: true,
    message: "User logged out successfully",
  };
};
