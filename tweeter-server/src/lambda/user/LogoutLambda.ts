import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: LogoutRequest
): Promise<LogoutResponse> => {
    const userService = new UserService();

    const authToken: string = request.authToken;

    await userService.logout(authToken);

    return {
        success: true,
        message: "User logged out successfully"
    }
};
