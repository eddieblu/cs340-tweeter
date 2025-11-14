import { PagedItemUserRequest, PagedItemUserResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: PagedItemUserRequest
): Promise<PagedItemUserResponse> => {
  // we want this handler to do
  // is use the data from the passed in request
  // to call the an instance of FollowService.loadMoreFollowees()

  const followService = new FollowService();
  const [items, hasMorePages] = await followService.loadMoreFollowees(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );

  return {
    success: true,
    message: "",
    items: items,
    hasMorePages: hasMorePages,
  };
};
