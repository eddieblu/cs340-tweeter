import { AuthToken, Status, FakeData, StatusDto } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService implements Service {
  /**
   * POST /story/list
   */
  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize);
  }

  /**
   * POST /feed/list
   */
  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize);
  }

  /**
   * POST /status/post
   */
  public async postStatus(
    token: string,
    newStatus: StatusDto
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  }

  //
  // Helper Functions
  //
  private async getFakeData(
    lastItem: StatusDto | null,
    pageSize: number,
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize,
    );
    return [items.map((status) => status.dto), hasMore];
  }
}
