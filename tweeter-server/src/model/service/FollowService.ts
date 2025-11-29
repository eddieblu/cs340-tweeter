import { User, UserDto } from "tweeter-shared";

import { Service } from "./Service";
import { DaoFactoryProvider } from "../dao/DaoFactoryProvider";
import { AuthorizationService } from "./AuthorizationService";

export class FollowService implements Service {
  private readonly followDao = DaoFactoryProvider.getFactory().getFollowDao();
  private readonly userDao = DaoFactoryProvider.getFactory().getUserDao();
  private readonly authorizationService = new AuthorizationService();

  async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return this.loadMoreUsers(
      token,
      userAlias,
      pageSize,
      lastItem,
      async (alias, size, last) => {
        const { followees, hasMore } = await this.followDao.getFolloweesPage(
          alias,
          size,
          last
        );
        return { users: followees, hasMore };
      }
    );
  }

  async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return this.loadMoreUsers(
      token,
      userAlias,
      pageSize,
      lastItem,
      async (alias, size, last) => {
        const { followers, hasMore } = await this.followDao.getFollowersPage(
          alias,
          size,
          last
        );
        return { users: followers, hasMore };
      }
    );
  }

  async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    await this.authorizationService.authorize(token);

    return this.followDao.isFollower(userAlias, selectedUserAlias);
  }

  async getFolloweeCount(token: string, userAlias: string): Promise<number> {
    await this.authorizationService.authorize(token);

    const followeeCount = await this.userDao.getFolloweeCount(userAlias);

    return followeeCount;
  }

  async getFollowerCount(token: string, userAlias: string): Promise<number> {
    await this.authorizationService.authorize(token);

    const followerCount = await this.userDao.getFollowerCount(userAlias);

    return followerCount;
  }

  async follow(
    token: string,
    userToFollowAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.modifyFollow(token, userToFollowAlias, 1, (follower, target) =>
      this.followDao.createFollow(follower, target)
    );
  }

  async unfollow(
    token: string,
    userToUnfollowAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.modifyFollow(
      token,
      userToUnfollowAlias,
      -1,
      (follower, target) => this.followDao.deleteFollow(follower, target)
    );
  }

  private toUserDtos(users: User[]): UserDto[] {
    return users.map((u) => u.dto);
  }

  private async loadMoreUsers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
    loader: (
      userAlias: string,
      pageSize: number,
      lastAlias: string | null
    ) => Promise<{ users: User[]; hasMore: boolean }>
  ): Promise<[UserDto[], boolean]> {
    await this.authorizationService.authorize(token);

    const lastAlias = lastItem ? lastItem.alias : null;

    const { users, hasMore } = await loader(userAlias, pageSize, lastAlias);

    return [this.toUserDtos(users), hasMore];
  }

  private async modifyFollow(
    token: string,
    targetAlias: string,
    delta: 1 | -1,
    action: (follower: string, target: string) => Promise<void>
  ): Promise<[number, number]> {
    const followerAlias = await this.authorizationService.authorize(token);

    const user = await this.userDao.getUser(targetAlias);
    if (!user) {
      throw new Error("User not found");
    }

    await action(followerAlias, targetAlias);

    await this.userDao.incrementFollowerCount(targetAlias, delta);
    await this.userDao.incrementFolloweeCount(followerAlias, delta);

    const followerCount = await this.userDao.getFollowerCount(targetAlias);
    const followeeCount = await this.userDao.getFolloweeCount(targetAlias);

    return [followerCount, followeeCount];
  }
}
