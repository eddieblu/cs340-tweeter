import {
  GetFolloweeCountRequest,
  GetFolloweeCountResponse,
} from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: GetFolloweeCountRequest
): Promise<GetFolloweeCountResponse> => {
  const followService = new FollowService();

  const count = await followService.getFolloweeCount(
    request.token,
    request.userAlias
  );

  return {
    success: true,
    message: "",
    count: count,
  };
};
