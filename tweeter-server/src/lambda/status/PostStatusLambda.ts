import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { AuthorizationService } from "../../model/service/AuthorizationService";

export const handler = async (
  request: PostStatusRequest
): Promise<PostStatusResponse> => {
  const authService = new AuthorizationService();
  await authService.authorize(request.token);

  const statusService = new StatusService();

  await statusService.postStatus(request.token, request.status);

  return {
    success: true,
    message: "",
  };
};
