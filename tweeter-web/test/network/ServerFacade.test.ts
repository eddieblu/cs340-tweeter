import "isomorphic-fetch";
import { ServerFacade } from "../../src/network/ServerFacade";

describe("ServerFacade", () => {
  let server: ServerFacade;

  beforeEach(() => {
    server = new ServerFacade();
  });

  it("can register a user", async () => {
    const request = {
      alias: "@allen",
      password: "password",
      firstName: "Test",
      lastName: "User",
      imageStringBase64: "",
      imageFileExtension: "png",
    };

    const [user, authToken] = await server.register(request);

    expect(user).toBeDefined();
    expect(user.alias).toBeDefined();
    expect(authToken).toBeDefined();
  });

  it("can get followers", async () => {
    const request = {
      token: "test-token",
      userAlias: "@allen",
      pageSize: 10,
      lastItem: null,
    };

    const [followers, hasMore] = await server.getMoreFollowers(request);

    expect(followers).toBeDefined();
    expect(Array.isArray(followers)).toBe(true);
  });

  it("can get followee count", async () => {
    const request = {
      token: "test-token",
      userAlias: "@allen",
    };

    const response = await server.getFolloweeCount(request);

    expect(response).toBeDefined();
    expect(typeof response).toBe("number");
  });

  it("can get followers count", async () => {
    const request = {
      token: "test-token",
      userAlias: "@allen",
    };

    const response = await server.getFollowerCount(request);

    expect(response).toBeDefined();
    expect(typeof response).toBe("number");
  });
});
