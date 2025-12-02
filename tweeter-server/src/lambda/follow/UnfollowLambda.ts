// tweeter-server/src/lambda/follow/FollowUserHandler.ts
import { UnfollowRequest, UnfollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AuthorizationService } from "../../model/service/AuthorizationService";

export const handler = async (
  request: UnfollowRequest
): Promise<UnfollowResponse> => {
  const authService = new AuthorizationService();
  await authService.authorize(request.token);

  const followService = new FollowService();

  const [followerCount, followeeCount] = await followService.unfollow(
    request.token,
    request.userToUnfollowAlias
  );

  return {
    success: true,
    message: "",
    followerCount,
    followeeCount,
  };
};
