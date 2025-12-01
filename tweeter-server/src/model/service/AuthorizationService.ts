import { DaoFactoryProvider } from "../dao/DaoFactoryProvider";
import { Service } from "./Service";

const SESSION_TIMEOUT_MINUTES = 30;
const SESSION_TIMEOUT_MS = SESSION_TIMEOUT_MINUTES * 60 * 1000;

export class AuthorizationService implements Service {
  private readonly authTokenDao =
    DaoFactoryProvider.getFactory().getAuthTokenDao();

  public async authorize(token: string): Promise<string> {
    if (!token) {
      throw new Error("unauthorized: missing auth token");
    }

    const authToken = await this.authTokenDao.getAuthToken(token);
    if (!authToken) {
      throw new Error("unauthorized: user not authenticated");
    }

    const now = Date.now();
    if (now - authToken.timestamp > SESSION_TIMEOUT_MS) {
      await this.authTokenDao.deleteAuthToken(token);
      throw new Error("unauthorized: session has expired");
    }

    const alias = await this.authTokenDao.getAliasForToken(token);
    if (!alias) {
      throw new Error("unauthorized: invalid auth token");
    }

    await this.authTokenDao.updateTimestamp(token, now);

    return alias;
  }
}
