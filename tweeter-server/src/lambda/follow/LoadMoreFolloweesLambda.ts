import { FollowService } from "../../model/service/FollowService";
import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared/src";

export const handler = async (
  request: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
  // we want this handler to do
  // is use the data from the passed in request
  // to call the an instance of FollowService.loadMoreFollowees()

  const followService = new FollowService();
  const [items, hasMore] = await followService.loadMoreFollowees(
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
