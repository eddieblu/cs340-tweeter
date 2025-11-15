import { GetFollowCountRequest, GetFollowCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: GetFollowCountRequest
): Promise<GetFollowCountResponse> => {
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
