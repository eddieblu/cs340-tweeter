import { AuthTokenDao } from "./AuthTokenDao";
import { FeedDao } from "./FeedDao";
import { FollowDao } from "./FollowDao";
import { S3Dao } from "./S3Dao";
import { StoryDao } from "./StoryDao";
import { UserDao } from "./UserDao";


export interface DaoFactory {
    getAuthTokenDao(): AuthTokenDao;
    getFeedDao(): FeedDao;
    getFollowDao(): FollowDao;
    getStoryDao(): StoryDao;
    getUserDao(): UserDao;
    getS3Dao(): S3Dao;
}