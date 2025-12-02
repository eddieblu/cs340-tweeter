import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import { DaoFactory } from "../DaoFactory";

import { AuthTokenDao } from "../AuthTokenDao";
import { FeedDao } from "../FeedDao";
import { FollowDao } from "../FollowDao";
import { StoryDao } from "../StoryDao";
import { UserDao } from "../UserDao";
import { S3Dao } from "../S3Dao";

import { DynamoAuthTokenDao } from "./DynamoAuthTokenDao";
import { DynamoFeedDao } from "./DynamoFeedDao";
import { DynamoFollowDao } from "./DynamoFollowDao";
import { DynamoStoryDao } from "./DynamoStoryDao";
import { DynamoUserDao } from "./DynamoUserDao";
import { AwsS3Dao } from "../aws/AwsS3Dao";

export class DynamoDaoFactory implements DaoFactory {
  private readonly docClient: DynamoDBDocumentClient;

  private authTokenDao?: AuthTokenDao;
  private feedDao?: FeedDao;
  private followDao?: FollowDao;
  private storyDao?: StoryDao;
  private userDao?: UserDao;
  private s3Dao?: S3Dao;

  constructor(docClient?: DynamoDBDocumentClient) {
    this.docClient =
      docClient ?? DynamoDBDocumentClient.from(new DynamoDBClient({}));
  }

  getAuthTokenDao(): AuthTokenDao {
    if (!this.authTokenDao) {
      this.authTokenDao = new DynamoAuthTokenDao(this.docClient);
    }
    return this.authTokenDao;
  }

  getFeedDao(): FeedDao {
    if (!this.feedDao) {
      this.feedDao = new DynamoFeedDao(this.docClient);
    }
    return this.feedDao;
  }

  getFollowDao(): FollowDao {
    if (!this.followDao) {
      this.followDao = new DynamoFollowDao(this.getUserDao(), this.docClient);
    }
    return this.followDao;
  }

  getStoryDao(): StoryDao {
    if (!this.storyDao) {
      this.storyDao = new DynamoStoryDao(this.docClient);
    }
    return this.storyDao;
  }

  getUserDao(): UserDao {
    if (!this.userDao) {
      this.userDao = new DynamoUserDao(this.docClient);
    }
    return this.userDao;
  }

  getS3Dao(): S3Dao {
    if (!this.s3Dao) {
      this.s3Dao = new AwsS3Dao();
    }
    return this.s3Dao;
  }
}
