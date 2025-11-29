import { AuthToken } from "tweeter-shared";
import { AuthTokenDao } from "../AuthTokenDao";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const TABLE_NAME = "authToken";

export class DynamoAuthTokenDao implements AuthTokenDao {
  private readonly docClient: DynamoDBDocumentClient;

  // constructor allows passing in docClient when testing/mocking
  constructor(docClient?: DynamoDBDocumentClient) {
    this.docClient =
      docClient ?? DynamoDBDocumentClient.from(new DynamoDBClient({}));
  }

  async createAuthToken(newAuthToken: AuthToken, alias: string): Promise<void> {
    const authTokenItem = {
      token: newAuthToken.token,
      alias: alias,
      timestamp: newAuthToken.timestamp,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: authTokenItem,
      })
    );
  }

  async getAuthToken(token: string): Promise<AuthToken | null> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { token },
      })
    );

    if (!result.Item) {
      return null;
    }

    const item = result.Item as {
      token: string;
      timestamp: number;
      alias?: string; // stored but not needed to recreate AuthToken
    };

    const authToken = new AuthToken(item.token, item.timestamp);

    return authToken;
  }

  async getAliasForToken(token: string): Promise<string | null> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { token },
        ProjectionExpression: "alias",
      })
    );

    if (!result.Item) {
      return null;
    }

    const item = result.Item as { alias?: string };
    return item.alias ?? null;
  }

  async deleteAuthToken(token: string): Promise<void> {
    await this.docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { token },
      })
    );
  }
}
