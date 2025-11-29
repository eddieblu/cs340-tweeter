import { AuthToken } from "tweeter-shared";

export interface AuthTokenDao {
    createAuthToken(authToken: AuthToken, alias: string): Promise<void>;

    getAuthToken(token: string): Promise<AuthToken | null>;

    getAliasForToken(token: string): Promise<string | null>;

    deleteAuthToken(token: string): Promise<void>;
}