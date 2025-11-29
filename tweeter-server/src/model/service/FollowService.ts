import { User, UserDto } from "tweeter-shared";

import { Service } from "./Service";
import { DaoFactoryProvider } from "../dao/DaoFactoryProvider";
import { AuthorizationService } from "./AuthorizationService";

export class FollowService implements Service {
  private readonly followDao = DaoFactoryProvider.getFactory().getFollowDao();
  private readonly userDao = DaoFactoryProvider.getFactory().getUserDao();
  private readonly authorizationService = new AuthorizationService();

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authorizationService.authorize(token);

    const lastFolloweeAlias = lastItem ? lastItem.alias : null;

    const { followees, hasMore } = await this.followDao.getFolloweesPage(
      userAlias,
      pageSize,
      lastFolloweeAlias
    );

    return [this.toUserDtos(followees), hasMore];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.authorizationService.authorize(token);

    const lastFollowerAlias = lastItem ? lastItem.alias : null;

    const { followers, hasMore } = await this.followDao.getFollowersPage(
      userAlias,
      pageSize,
      lastFollowerAlias
    );

    return [this.toUserDtos(followers), hasMore];
  }

  public async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    await this.authorizationService.authorize(token);

    return this.followDao.isFollower(userAlias, selectedUserAlias);
  }

  public async getFolloweeCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    await this.authorizationService.authorize(token);

    const followeeCount = await this.userDao.getFolloweeCount(userAlias);

    return followeeCount;
  }

  public async getFollowerCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    await this.authorizationService.authorize(token);

    const followerCount = await this.userDao.getFollowerCount(userAlias);

    return followerCount;
  }

  public async follow(
    token: string,
    userToFollowAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followerAlias = await this.authorizationService.authorize(token);

    const targetUser = await this.userDao.getUser(userToFollowAlias);
    if (!targetUser) {
      throw new Error("User to follow not found");
    }

    await this.followDao.createFollow(followerAlias, userToFollowAlias);

    await this.userDao.incrementFollowerCount(userToFollowAlias, 1);
    await this.userDao.incrementFolloweeCount(followerAlias, 1);

    const followerCount = await this.userDao.getFollowerCount(
      userToFollowAlias
    );
    const followeeCount = await this.userDao.getFolloweeCount(
      userToFollowAlias
    );

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollowAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    const followerAlias = await this.authorizationService.authorize(token);

    const targetUser = await this.userDao.getUser(userToUnfollowAlias);
    if (!targetUser) {
      throw new Error("User to unfollow not found");
    }

    await this.followDao.deleteFollow(followerAlias, userToUnfollowAlias);

    await this.userDao.incrementFollowerCount(userToUnfollowAlias, -1);
    await this.userDao.incrementFolloweeCount(followerAlias, -1);

    const followerCount = await this.userDao.getFollowerCount(
      userToUnfollowAlias
    );
    const followeeCount = await this.userDao.getFolloweeCount(
      userToUnfollowAlias
    );

    return [followerCount, followeeCount];
  }

  private toUserDtos(users: User[]): UserDto[] {
    return users.map((u) => u.dto);
  }
}
