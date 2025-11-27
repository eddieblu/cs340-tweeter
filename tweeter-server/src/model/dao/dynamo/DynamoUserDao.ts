import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import { User } from "tweeter-shared";
import { UserDao } from "../UserDao";

const USER_TABLE_NAME = "user";

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
        TableName: USER_TABLE_NAME,
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
        TableName: USER_TABLE_NAME,
        Item: userItem,
        // fail if a user with this alias already exists
        ConditionExpression: "attribute_not_exists(alias)",
      })
    );
  }

  async getPasswordHash(alias: string): Promise<string | null> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: USER_TABLE_NAME,
        Key: { alias },
        ProjectionExpression: "passwordHash",
      })
    );

    if (!result.Item) {
      return null;
    }

    return result.Item.passwordHash ?? null;
  }

  async incrementFollowerCount(alias: string, delta: number): Promise<void> {
    return this.updateCount(alias, "followerCount", delta);
  }

  async incrementFolloweeCount(alias: string, delta: number): Promise<void> {
    return this.updateCount(alias, "followeeCount", delta);
  }

  private async updateCount(
    alias: string,
    attribute: "followerCount" | "followeeCount",
    delta: number
  ): Promise<void> {
    await this.docClient.send(
      new UpdateCommand({
        TableName: USER_TABLE_NAME,
        Key: { alias },
        UpdateExpression: `ADD ${attribute} :delta`,
        ExpressionAttributeValues: {
          ":delta": delta,
        },
      })
    );
  }
}
