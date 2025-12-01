import { Status, StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactoryProvider } from "../dao/DaoFactoryProvider";
import { AuthorizationService } from "./AuthorizationService";

export class StatusService implements Service {
  private readonly storyDao = DaoFactoryProvider.getFactory().getStoryDao();
  private readonly feedDao = DaoFactoryProvider.getFactory().getFeedDao();
  private readonly followDao = DaoFactoryProvider.getFactory().getFollowDao();
  private readonly authorizationService = new AuthorizationService();

  async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authorizationService.authorize(token);

    const lastStatus: Status | undefined = lastItem
      ? Status.fromDto(lastItem) ?? undefined
      : undefined;

    const { statuses, hasMore } = await this.storyDao.getStoryPage(
      userAlias,
      pageSize,
      lastStatus
    );

    const dtos = statuses.map((s) => s.dto);
    return [dtos, hasMore];
  }

  async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authorizationService.authorize(token);

    const lastStatus: Status | undefined = lastItem
      ? Status.fromDto(lastItem) ?? undefined
      : undefined;

    const { statuses, hasMore } = await this.feedDao.getFeedPage(
      userAlias,
      pageSize,
      lastStatus
    );

    const dtos = statuses.map((s) => s.dto);
    return [dtos, hasMore];
  }

  async postStatus(token: string, newStatusDto: StatusDto): Promise<void> {
    const authorAlias = await this.authorizationService.authorize(token);

    const status = Status.fromDto(newStatusDto);
    if (!status) {
      throw new Error("bad-status: invalid status data");
    }

    if (authorAlias !== status.user.alias) {
      throw new Error("unauthorized: cannot post status for another user");
    }

    await this.storyDao.addStatusToStory(status);

    const followerAliases = await this.followDao.getFollowerAliases(
      authorAlias
    );

    await this.feedDao.addStatusToFeeds(status, followerAliases);
  }
}
