import { Buffer } from "buffer";
import {
  AuthToken,
  User,
  GetUserRequest,
  LoginRequest,
  RegisterRequest,
  LogoutRequest,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService implements Service {
  private serverFacade = new ServerFacade();

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    const request: GetUserRequest = {
      token: authToken.token,
      userAlias: alias,
    };

    return this.serverFacade.getUser(request);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const request: LoginRequest = {
      alias: alias,
      password: password,
    };

    const [user, authToken] = await this.serverFacade.login(request);

    return [user, authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const request: RegisterRequest = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      imageStringBase64: imageStringBase64,
      imageFileExtension: imageFileExtension,
    };

    return this.serverFacade.register(request);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const request: LogoutRequest = {
      token: authToken.token,
    }

    await this.serverFacade.logout(request);
  }
}
