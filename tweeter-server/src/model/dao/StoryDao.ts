import { Status } from "tweeter-shared";

export interface StoryDao {
  addStatusToStory(status: Status): Promise<void>;

  getStoryPage(
    userAlias: string,
    pageSize: number,
    lastStatus?: Status
  ): Promise<{ statuses: Status[]; hasMore: boolean }>;
}
