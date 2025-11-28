import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import { Status, User } from "tweeter-shared";
import { FeedDao } from "../FeedDao";
import { DynamoStatusPageDaoBase } from "./base/DynamoStatusPageDao";

const TABLE_NAME = "feed";

export class DynamoFeedDao extends DynamoStatusPageDaoBase implements FeedDao {
  constructor(docClient?: DynamoDBDocumentClient) {
    super(docClient);
  }

  async addStatusToFeeds(
    status: Status,
    followerAliases: string[]
  ): Promise<void> {
    const author = status.user;

    const puts = followerAliases.map((receiverAlias) => {
      const statusItem = {
        receiver_alias: receiverAlias, // PK
        timestamp: status.timestamp, // SK

        // status content
        post: status.post,

        // denormalized author info
        author_firstName: author.firstName,
        author_lastName: author.lastName,
        author_alias: author.alias,
        author_imageUrl: author.imageUrl,
      };

      return this.docClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: statusItem,
        })
      );
    });

    await Promise.all(puts);
  }

  async getFeedPage(
    userAlias: string,
    pageSize: number,
    lastStatus?: Status
  ): Promise<{ statuses: Status[]; hasMore: boolean }> {
    return this.getStatusPage(
      TABLE_NAME,
      "receiver_alias",
      userAlias,
      pageSize,
      lastStatus,
      (raw) => {
        const item = raw as {
          receiver_alias: string;
          timestamp: number;
          post: string;
          author_alias: string;
          author_firstName: string;
          author_lastName: string;
          author_imageUrl: string;
        };

        const author = new User(
          item.author_firstName,
          item.author_lastName,
          item.author_alias,
          item.author_imageUrl
        );

        return new Status(item.post, author, item.timestamp);
      }
    );
  }
}
