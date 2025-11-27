import { Status } from "tweeter-shared";

export interface FeedDao {
  addStatusToFeeds(status: Status, followerAliases: string[]): Promise<void>;

  getFeedPage(
    userAlias: string,
    pageSize: number,
    lastStatus?: Status
  ): Promise<{ statuses: Status[]; hasMore: boolean }>;
}
