import { FakeData, UserDto, AuthTokenDto } from "tweeter-shared";
import { Service } from "./Service";

export class UserService implements Service {
  /**
   * POST /user/get
   */
  public async getUser(
    token: string,
    userAlias: string
  ): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    const user = FakeData.instance.findUserByAlias(userAlias);
    return user?.dto || null;
  }

  /**
   * POST /user/login
   */
  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;
    const authToken = FakeData.instance.authToken;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user.dto, authToken.dto];
  }

  /**
   * POST /user/register
   */
  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;
    const authToken = FakeData.instance.authToken;

    if (user === null || authToken === null) {
      throw new Error("Invalid registration");
    }

    return [user.dto, authToken.dto];
  }

  /**
   * POST /user/logout
   */
  public async logout(authToken: string): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));

    // M3: no-op.
    // M4: actually invalidate token in DB.
  }
}
