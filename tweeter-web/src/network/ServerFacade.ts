import {
  FollowRequest,
  FollowResponse,
  GetFollowCountRequest,
  GetFollowCountResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  PagedItemRequest,
  PagedItemResponse,
  Status,
  StatusDto,
  UnfollowRequest,
  UnfollowResponse,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://nzy5ok5fh6.execute-api.us-east-1.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  //
  // FollowService methods
  //

  public async getMoreFollowees(
    request: PagedItemRequest<UserDto>
  ): Promise<[User[], boolean]> {
    return this.getMoreItemsPaged<UserDto, User>(
      "/followee/list",
      request,
      (dto: UserDto) => User.fromDto(dto)!,
      "followees"
    );
  }

  public async getMoreFollowers(
    request: PagedItemRequest<UserDto>
  ): Promise<[User[], boolean]> {
    return this.getMoreItemsPaged<UserDto, User>(
      "/follower/list",
      request,
      (dto: UserDto) => User.fromDto(dto)!,
      "followers"
    );
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(request, "/follow/is-follower");

    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(
        response.message ?? "Failed to determine follower status"
      );
    }
  }

  async getFolloweeCount(request: GetFollowCountRequest) {
    return this.getFollowCount(request, "/followee/count");
  }

  async getFollowerCount(request: GetFollowCountRequest) {
    return this.getFollowCount(request, "/follower/count");
  }

  async follow(request: FollowRequest) {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, "/follow/follow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? "Failed to follow user");
    }
  }

  async unfollow(request: UnfollowRequest) {
    const response = await this.clientCommunicator.doPost<
      UnfollowRequest,
      UnfollowResponse
    >(request, "/follow/unfollow");

    if (response.success) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? "Failed to unfollow user");
    }
  }

  //
  // StatusService methods
  //

  public async getMoreStoryItems(
    request: PagedItemRequest<StatusDto>
  ): Promise<[Status[], boolean]> {
    return this.getMoreItemsPaged<StatusDto, Status>(
      "/story/list",
      request,
      (dto: StatusDto) => Status.fromDto(dto)!,
      "story items"
    );
  }

  public async getMoreFeedItems(
    request: PagedItemRequest<StatusDto>
  ): Promise<[Status[], boolean]> {
    return this.getMoreItemsPaged<StatusDto, Status>(
      "/feed/list",
      request,
      (dto: StatusDto) => Status.fromDto(dto)!,
      "feed items"
    );
  }

  //
  // Helpers
  //

  private async getMoreItemsPaged<TDto, TDomain>(
    path: string,
    request: PagedItemRequest<TDto>,
    fromDto: (dto: TDto) => TDomain,
    itemType: string
  ): Promise<[TDomain[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<TDto>,
      PagedItemResponse<TDto>
    >(request, path);

    const items: TDomain[] | null =
      response.success && response.items
        ? response.items.map((dto) => fromDto(dto))
        : null;

    if (response.success) {
      if (items == null) {
        throw new Error(`No ${itemType} found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Failed to get more " + itemType);
    }
  }

  private async getFollowCount(
    request: GetFollowCountRequest,
    path: string
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetFollowCountRequest,
      GetFollowCountResponse
    >(request, path);

    if (response.success && response.count !== undefined) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message ?? "Failed to get follow count");
    }
  }
}
