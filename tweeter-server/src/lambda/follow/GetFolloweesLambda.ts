import { FollowService } from "../../model/service/FollowService";
import { PagedItemRequest,PagedItemResponse, UserDto } from "tweeter-shared";

export const handler = async (
  request: PagedItemRequest<UserDto>
): Promise<PagedItemResponse<UserDto>> => {
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

// notes

// we want this handler to do
// is use the data from the passed in request
// to call the an instance of FollowService.loadMoreFollowees()

// TODO: refactor duplicate code bt LoadMoreFollowEES and LoadMoreFollowERS?
// or leave glue code?
