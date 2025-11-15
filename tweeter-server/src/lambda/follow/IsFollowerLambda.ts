import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: IsFollowerRequest
): Promise<IsFollowerResponse> => {
  const followService = new FollowService();

  const isFollower = await followService.getIsFollowerStatus(
    request.authToken,
    request.userAlias,
    request.selectedUserAlias
  );
  
  return {
    success: true,
    message: "",
    isFollower: isFollower, 
  };
};
