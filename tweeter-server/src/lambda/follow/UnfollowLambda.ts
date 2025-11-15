// tweeter-server/src/lambda/follow/FollowUserHandler.ts
import { UnfollowRequest, UnfollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: UnfollowRequest
): Promise<UnfollowResponse> => {
  const followService = new FollowService();

  // server-side FollowService method; name however you like
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
