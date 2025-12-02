import { GetFollowCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AuthorizationService } from "../../model/service/AuthorizationService";

export const handler = async (
  request: GetFollowCountRequest
): Promise<GetFollowCountResponse> => {
  const authService = new AuthorizationService();
  await authService.authorize(request.token);

  const followService = new FollowService();

  const count = await followService.getFollowerCount(
    request.token,
    request.userAlias
  );

  return {
    success: true,
    message: "",
    count: count,
  };
};
