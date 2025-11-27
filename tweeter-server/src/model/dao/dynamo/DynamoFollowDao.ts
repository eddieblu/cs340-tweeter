import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";

import { FollowDao } from "../FollowDao";
import { User } from "tweeter-shared";
import { UserDao } from "../UserDao";

const FOLLOW_TABLE_NAME = "follow";
const FOLLOW_INDEX_NAME = "follow_index";

export class DynamoFollowDao implements FollowDao {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly userDao: UserDao;

  // constructor allows passing in docClient when testing/mocking
  constructor(userDao: UserDao, docClient?: DynamoDBDocumentClient) {
    this.userDao = userDao;
    this.docClient =
      docClient ?? DynamoDBDocumentClient.from(new DynamoDBClient({}));
  }

  async createFollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<void> {
    const followItem = {
      follower_alias: followerAlias,
      followee_alias: followeeAlias,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: FOLLOW_TABLE_NAME,
        Item: followItem,
        ConditionExpression:
          "attribute_not_exists(follower_alias) AND attribute_not_exists(followee_alias)",
      })
    );
  }

  async deleteFollow(
    followerAlias: string,
    followeeAlias: string
  ): Promise<void> {
    await this.docClient.send(
      new DeleteCommand({
        TableName: FOLLOW_TABLE_NAME,
        Key: {
          follower_alias: followerAlias,
          followee_alias: followeeAlias,
        },
      })
    );
  }

  async isFollower(
    followerAlias: string,
    followeeAlias: string
  ): Promise<boolean> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: FOLLOW_TABLE_NAME,
        Key: {
          follower_alias: followerAlias,
          followee_alias: followeeAlias,
        },
      })
    );

    // !!{ ... }    → true
    // !!undefined  → false
    return !!result.Item;
  }

  async getFollowersPage(
    targetAlias: string,
    pageSize: number,
    lastFollowerAlias: string | null
  ): Promise<{ followers: User[]; hasMore: boolean }> {
    const queryInput: QueryCommandInput = {
      TableName: FOLLOW_TABLE_NAME,
      IndexName: FOLLOW_INDEX_NAME,
      KeyConditionExpression: "followee_alias = :targetAlias",
      ExpressionAttributeValues: {
        ":targetAlias": targetAlias,
      },
      Limit: pageSize,
    };

    if (lastFollowerAlias) {
      queryInput.ExclusiveStartKey = {
        followee_alias: targetAlias,
        follower_alias: lastFollowerAlias,
      };
    }

    const { users, hasMore } = await this.getUsersPageForQuery(
      queryInput,
      "follower_alias"
    );

    return { followers: users, hasMore };
  }

  async getFolloweesPage(
    followerAlias: string,
    pageSize: number,
    lastFolloweeAlias: string | null
  ): Promise<{ followees: User[]; hasMore: boolean }> {
    const queryInput: QueryCommandInput = {
      TableName: FOLLOW_TABLE_NAME,
      KeyConditionExpression: "follower_alias = :follower",
      ExpressionAttributeValues: {
        ":follower": followerAlias,
      },
      Limit: pageSize,
    };

    if (lastFolloweeAlias) {
      queryInput.ExclusiveStartKey = {
        follower_alias: followerAlias,
        followee_alias: lastFolloweeAlias,
      };
    }

    const { users, hasMore } = await this.getUsersPageForQuery(
      queryInput,
      "followee_alias"
    );

    return { followees: users, hasMore };
  }
  
  private async getUsersPageForQuery(
    queryInput: QueryCommandInput,
    aliasAttribute: "follower_alias" | "followee_alias"
  ): Promise<{ users: User[]; hasMore: boolean }> {
    const result = await this.docClient.send(new QueryCommand(queryInput));

    const aliases: string[] =
      result.Items?.map((item) => item[aliasAttribute] as string) ?? [];

    const users: User[] = await this.loadUsers(aliases);

    return {
      users,
      hasMore: !!result.LastEvaluatedKey,
    };
  }

  private async loadUsers(aliases: string[]): Promise<User[]> {
    if (aliases.length === 0) {
      return [];
    }

    const users = await Promise.all(
      aliases.map((alias) => this.userDao.getUser(alias))
    );

    // filter out any nulls (in case some users were not found)
    return users.filter((user): user is User => user !== null);
  }
}
