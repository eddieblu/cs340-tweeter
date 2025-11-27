import { User } from "tweeter-shared";

export interface FollowDao {
  createFollow(followerAlias: string, followeeAlias: string): Promise<void>;

  deleteFollow(followerAlias: string, followeeAlias: string): Promise<void>;

  isFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;

  /**
   * Get a page of users who follow the targetAlias user.
   */
  getFollowersPage(
    targetAlias: string,
    pageSize: number,
    lastFollowerAlias: string | null
  ): Promise<{ followers: User[]; hasMore: boolean }>;

  /**
   * Get a page of users that followerAlias is following.
   */
  getFolloweesPage(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | null
  ): Promise<{ followees: User[]; hasMore: boolean }>;
}
