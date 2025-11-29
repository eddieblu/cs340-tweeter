import { UserDto, AuthTokenDto, AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactoryProvider } from "../dao/DaoFactoryProvider";
import { AuthorizationService } from "./AuthorizationService";

export class UserService implements Service {
  private readonly userDao = DaoFactoryProvider.getFactory().getUserDao();
  private readonly authTokenDao =
    DaoFactoryProvider.getFactory().getAuthTokenDao();
  private readonly authorizationService = new AuthorizationService();

  async getUser(
    token: string,
    userAlias: string
  ): Promise<UserDto> {
    await this.authorizationService.authorize(token);

    const user = await this.userDao.getUser(userAlias);
    if (!user) {
      throw new Error("User not found");
    }
    return user.dto;
  }

  async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const user = await this.userDao.getUser(alias);
    if (!user) {
      throw new Error("Invalid alias or password");
    }

    // TODO: bcrypt.compare() will go here later for password check

    const authToken = await this.createAndPersistAuthToken(alias);

    return [user.dto, authToken.dto];
  }

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const existing = await this.userDao.getUser(alias);
    if (existing) {
      throw new Error("Alias already exists");
    }

    const imageUrl = ""; // TODO: replace with real S3 URL in S3 step

    const newUser = new User(firstName, lastName, alias, imageUrl);

    const passwordHash = password; // TODO: replace with bcrypt hash in bcrypt step

    await this.userDao.createUser(newUser, passwordHash);

    const authToken = await this.createAndPersistAuthToken(alias);

    return [newUser.dto, authToken.dto];
  }

  async logout(authToken: string): Promise<void> {
    await this.authTokenDao.deleteAuthToken(authToken);
  }

  private async createAndPersistAuthToken(alias: string): Promise<AuthToken> {
    const authToken = AuthToken.Generate();
    await this.authTokenDao.createAuthToken(authToken, alias);
    return authToken;
  }
}
