import { User, FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class FollowService implements Service {
  /**
   * POST /followee/list
   */
  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  /**
   * POST /follower/list
   */
  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  /**
   * POST /follow/is-follower
   */
  public async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  /**
   * POST /followee/count
   */
  public async getFolloweeCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(userAlias);
  }

  /**
   * POST /follower/count
   */
  public async getFollowerCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(userAlias);
  }

  /**
   * POST /follow/follow
   */
  public async follow(
    token: string,
    userToFollowAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(token, userToFollowAlias);
    const followeeCount = await this.getFolloweeCount(token, userToFollowAlias);

    return [followerCount, followeeCount];
  }

  /**
   * POST /follow/unfollow
   */
  public async unfollow(
    token: string,
    userToUnfollowAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(
      token,
      userToUnfollowAlias
    );
    const followeeCount = await this.getFolloweeCount(
      token,
      userToUnfollowAlias
    );

    return [followerCount, followeeCount];
  }

  //
  // Helper Functions
  //
  private async getFakeData(
    lastItem: UserDto | null,
    pageSize: number,
    userAlias: string
  ): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(
      User.fromDto(lastItem),
      pageSize,
      userAlias
    );
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }
}
