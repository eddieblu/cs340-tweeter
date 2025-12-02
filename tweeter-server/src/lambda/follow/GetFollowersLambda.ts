import { AuthorizationService } from "../../model/service/AuthorizationService";
import { FollowService } from "../../model/service/FollowService";
import { PagedItemRequest, PagedItemResponse, UserDto } from "tweeter-shared";

export const handler = async (
  request: PagedItemRequest<UserDto>
): Promise<PagedItemResponse<UserDto>> => {
  const authService = new AuthorizationService();
  await authService.authorize(request.token);

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
