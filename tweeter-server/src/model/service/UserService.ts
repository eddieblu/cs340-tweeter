import { UserDto, AuthTokenDto, AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactoryProvider } from "../dao/DaoFactoryProvider";

export class UserService implements Service {
  private readonly userDao = DaoFactoryProvider.getFactory().getUserDao();
  private readonly authTokenDao =
    DaoFactoryProvider.getFactory().getAuthTokenDao();

  public async getUser(
    token: string,
    userAlias: string
  ): Promise<UserDto | null> {
    await this.validateToken(token);

    const user = await this.userDao.getUser(userAlias);
    if (!user) {
      throw new Error("User not found");
    }
    return user.dto;
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const user = await this.userDao.getUser(alias);
    if (!user) {
      throw new Error("Invalid alias or password");
    }

    // bcrypt.compare() will go here later for password check

    const authToken = await this.createAndPersistAuthToken();

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
    const existing = await this.userDao.getUser(alias);
    if (existing) {
      throw new Error("Alias already exists");
    }

    const imageUrl = ""; // TODO: replace with real S3 URL in S3 step

    const newUser = new User(firstName, lastName, alias, imageUrl);

    const passwordHash = password; // TODO: replace with bcrypt hash in bcrypt step

    await this.userDao.createUser(newUser, passwordHash);

    const authToken = await this.createAndPersistAuthToken();

    return [newUser.dto, authToken.dto];
  }

  public async logout(authToken: string): Promise<void> {
    await this.authTokenDao.deleteAuthToken(authToken);
  }

  private async createAndPersistAuthToken(): Promise<AuthToken> {
    const authToken = AuthToken.Generate();
    await this.authTokenDao.createAuthToken(authToken);
    return authToken;
  }

  private async validateToken(token: string): Promise<void> {
    const storedToken = await this.authTokenDao.getAuthToken(token);
    if (!storedToken) {
      throw new Error("Invalid or expired auth token");
    }
  }
}
