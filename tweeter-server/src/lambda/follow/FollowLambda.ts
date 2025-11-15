// tweeter-server/src/lambda/follow/FollowUserHandler.ts
import { FollowRequest, FollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: FollowRequest
): Promise<FollowResponse> => {
  const followService = new FollowService();

  // server-side FollowService method; name however you like
  const [followerCount, followeeCount] = await followService.follow(
    request.token,
    request.userToFollow
  );

  return {
    success: true,
    message: "",
    followerCount,
    followeeCount,
  };
};
