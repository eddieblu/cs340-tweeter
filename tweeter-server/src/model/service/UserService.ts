import { Buffer } from "buffer";
import {
  AuthToken,
  User,
  FakeData,
  UserDto,
  AuthTokenDto,
} from "tweeter-shared";
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
    const authtoken = FakeData.instance.authToken;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user.dto, authtoken.dto];
  }

  /**
   * POST /user/register
   */
  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
  }

  /**
   * POST /user/logout
   */
  public async logout(token: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  }
}
