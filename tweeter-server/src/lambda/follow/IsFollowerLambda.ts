import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AuthorizationService } from "../../model/service/AuthorizationService";

export const handler = async (
  request: IsFollowerRequest
): Promise<IsFollowerResponse> => {
  const authService = new AuthorizationService();
  await authService.authorize(request.token);

  const followService = new FollowService();

  const isFollower = await followService.getIsFollowerStatus(
    request.token,
    request.userAlias,
    request.selectedUserAlias
  );

  return {
    success: true,
    message: "",
    isFollower: isFollower,
  };
};
