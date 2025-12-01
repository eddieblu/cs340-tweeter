import { AuthToken } from "tweeter-shared";

export interface AuthTokenDao {
  createAuthToken(authToken: AuthToken, alias: string): Promise<void>;

  getAuthToken(token: string): Promise<AuthToken | null>;

  getAliasForToken(token: string): Promise<string | null>;

  updateTimestamp(token: string, now: number): Promise<void>;

  deleteAuthToken(token: string): Promise<void>;
}
