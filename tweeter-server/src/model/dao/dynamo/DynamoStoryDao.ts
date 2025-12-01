import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import { Status, User } from "tweeter-shared";
import { StoryDao } from "../StoryDao";
import { DynamoStatusPageDaoBase } from "./base/DynamoStatusPageDao";

const TABLE_NAME = "story";

export class DynamoStoryDao
  extends DynamoStatusPageDaoBase
  implements StoryDao
{
  constructor(docClient?: DynamoDBDocumentClient) {
    super(docClient);
  }
  async addStatusToStory(status: Status): Promise<void> {
    const user = status.user;

    const statusItem = {
      author_alias: user.alias, // PK
      timestamp: status.timestamp, // SK

      post: status.post,

      user_firstName: user.firstName,
      user_lastName: user.lastName,
      user_imageUrl: user.imageUrl,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: statusItem,
      })
    );
  }

  async getStoryPage(
    userAlias: string,
    pageSize: number,
    lastStatus?: Status
  ): Promise<{ statuses: Status[]; hasMore: boolean }> {
    return this.getStatusPage(
      TABLE_NAME,
      "author_alias",
      userAlias,
      pageSize,
      lastStatus,
      (raw) => {
        const item = raw as {
          author_alias: string;
          timestamp: number;
          post: string;
          user_firstName: string;
          user_lastName: string;
          user_imageUrl: string;
        };

        const user = new User(
          item.user_firstName,
          item.user_lastName,
          item.author_alias,
          item.user_imageUrl
        );

        return new Status(item.post, user, item.timestamp);
      }
    );
  }
}
