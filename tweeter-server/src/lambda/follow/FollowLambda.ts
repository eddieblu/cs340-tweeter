// tweeter-server/src/lambda/follow/FollowUserHandler.ts
import { FollowRequest, FollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AuthorizationService } from "../../model/service/AuthorizationService";

export const handler = async (
  request: FollowRequest
): Promise<FollowResponse> => {
  const authService = new AuthorizationService();
  await authService.authorize(request.token);
  
  const followService = new FollowService();

  const [followerCount, followeeCount] = await followService.follow(
    request.token,
    request.userToFollowAlias
  );

  return {
    success: true,
    message: "",
    followerCount,
    followeeCount,
  };
};
