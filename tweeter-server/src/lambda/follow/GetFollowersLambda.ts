import { FollowService } from "../../model/service/FollowService";
import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";

export const handler = async (
  request: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
  const followService = new FollowService();
  
  const [items, hasMore] = await followService.loadMoreFollowers(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );

  return {
    success: true,
    message: "",
    items: items,
    hasMore: hasMore,
  };
};

// TODO: rename this function to GetFollowersLambda
