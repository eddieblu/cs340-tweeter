import { DaoFactoryProvider } from "../dao/DaoFactoryProvider";
import { Service } from "./Service";

export class AuthorizationService implements Service {
  private readonly authTokenDao =
    DaoFactoryProvider.getFactory().getAuthTokenDao();

  public async authorize(token: string): Promise<string> {
    if (!token) {
      throw new Error("unauthorized: missing auth token");
    }

    const alias = await this.authTokenDao.getAliasForToken(token);
    if (!alias) {
      throw new Error("unauthorized: invalid auth token");
    }

    return alias;
  }
}
