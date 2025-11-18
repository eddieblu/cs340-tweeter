import "isomorphic-fetch"
import { ServerFacade } from "../../../src/network/ServerFacade";

describe("StatusService", () => {
  let server: ServerFacade;

  beforeEach(() => {
    server = new ServerFacade();
  });

  it("can get a user's story pages", async () => {
    const request = {
      token: "test-token",
      userAlias: "@allen",
      pageSize: 5,
      lastItem: null,
    };

    const [statuses, hasMore] = await server.getMoreStoryItems(request);

    expect(statuses).toBeDefined();
    expect(Array.isArray(statuses)).toBe(true);
  });
});
