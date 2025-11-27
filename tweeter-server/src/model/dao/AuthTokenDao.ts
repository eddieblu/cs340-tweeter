import { AuthToken } from "tweeter-shared";

export interface AuthTokenDao {
    createAuthToken(authToken: AuthToken): Promise<void>;

    getAuthToken(token: string): Promise<AuthToken | null>;

    deleteAuthToken(token: string): Promise<void>;
}