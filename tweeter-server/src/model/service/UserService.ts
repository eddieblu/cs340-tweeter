import { FakeData, UserDto, AuthTokenDto } from "tweeter-shared";
import { Service } from "./Service";

export class UserService implements Service {
  public async getUser(
    token: string,
    userAlias: string
  ): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    const user = FakeData.instance.findUserByAlias(userAlias);
    return user?.dto || null;
  }

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

  public async logout(authToken: string): Promise<void> {
    // M3: no-op.
    // M4: actually invalidate token in DB.
  }
}

