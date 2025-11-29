import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import { User } from "tweeter-shared";
import { UserDao } from "../UserDao";

const TABLE_NAME = "user";

export class DynamoUserDao implements UserDao {
  private readonly docClient: DynamoDBDocumentClient;

  // constructor allows passing in docClient when testing/mocking
  constructor(docClient?: DynamoDBDocumentClient) {
    this.docClient =
      docClient ?? DynamoDBDocumentClient.from(new DynamoDBClient({}));
  }

  async getUser(alias: string): Promise<User | null> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { alias },
      })
    );

    if (!result.Item) {
      return null;
    }

    const item = result.Item as {
      firstName: string;
      lastName: string;
      alias: string;
      imageUrl: string;
    };

    const user = new User(
      item.firstName,
      item.lastName,
      item.alias,
      item.imageUrl
    );

    return user;
  }

  async createUser(newUser: User, passwordHash: string): Promise<void> {
    const userItem = {
      alias: newUser.alias, // explicit PK first
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      imageUrl: newUser.imageUrl,

      followerCount: 0,
      followeeCount: 0,
      passwordHash,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: userItem,
        // fail if a user with this alias already exists
        ConditionExpression: "attribute_not_exists(alias)",
      })
    );
  }

  async getPasswordHash(alias: string): Promise<string | null> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { alias },
        ProjectionExpression: "passwordHash",
      })
    );

    if (!result.Item) {
      return null;
    }

    const item = result.Item as { passwordHash?: string };
    return item.passwordHash ?? null;
  }

  async incrementFollowerCount(alias: string, delta: number): Promise<void> {
    return this.updateCount(alias, "followerCount", delta);
  }

  async incrementFolloweeCount(alias: string, delta: number): Promise<void> {
    return this.updateCount(alias, "followeeCount", delta);
  }

  async getFollowerCount(alias: string): Promise<number> {
    return this.getUserCount(alias, "followerCount");
  }

  async getFolloweeCount(alias: string): Promise<number> {
    return this.getUserCount(alias, "followeeCount");
  }

  private async updateCount(
    alias: string,
    attribute: "followerCount" | "followeeCount",
    delta: number
  ): Promise<void> {
    await this.docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { alias },
        UpdateExpression: `ADD ${attribute} :delta`,
        ExpressionAttributeValues: {
          ":delta": delta,
        },
      })
    );
  }

  private async getUserCount(
    alias: string,
    field: "followerCount" | "followeeCount"
  ): Promise<number> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { alias },
        ProjectionExpression: field,
      })
    );

    if (!result.Item) {
      throw new Error("User not found");
    }

    const item = result.Item as any;
    return item[field] ?? 0;
  }
}
