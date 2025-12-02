import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService implements Service {
  private serverFacade = new ServerFacade();

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };

    return this.serverFacade.getMoreFollowees(request);
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };

    return this.serverFacade.getMoreFollowers(request);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const request = {
      token: authToken.token,
      userAlias: user.alias,
      selectedUserAlias: selectedUser.alias,
    };

    return this.serverFacade.getIsFollowerStatus(request);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request = {
      token: authToken.token,
      userAlias: user.alias,
    };

    return this.serverFacade.getFolloweeCount(request);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request = {
      token: authToken.token,
      userAlias: user.alias,
    };

    return this.serverFacade.getFollowerCount(request);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request = {
      token: authToken.token,
      userToFollowAlias: userToFollow.alias,
    };

    const [followerCount, followeeCount] = await this.serverFacade.follow(
      request
    );
    return [followerCount, followeeCount];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request = {
      token: authToken.token,
      userToUnfollowAlias: userToUnfollow.alias,
    };

    const [followerCount, followeeCount] = await this.serverFacade.unfollow(
      request
    );
    return [followerCount, followeeCount];
  }
}