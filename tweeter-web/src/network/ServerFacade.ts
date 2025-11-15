import {
  GetFollowCountRequest,
  GetFollowCountResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://nzy5ok5fh6.execute-api.us-east-1.amazonaws.com/prod";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    return this.getMoreUsersPaged("/followee/list", request, "followees");
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    return this.getMoreUsersPaged("/follower/list", request, "followers");
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

  public async getFolloweeCount(request: GetFollowCountRequest) {
    return this.getFollowCount(request, "/followee/count");
  }

  public async getFollowerCount(request: GetFollowCountRequest) {
    return this.getFollowCount(request, "/follower/count");
  }

  //
  // Helpers
  //

  private async getMoreUsersPaged(
    path: string,
    request: PagedUserItemRequest,
    itemType: string
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, path);

    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
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
