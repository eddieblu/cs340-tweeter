import { AuthTokenDao } from "./AuthTokenDao";
import { FeedDao } from "./FeedDao";
import { FollowDao } from "./FollowDao";
import { StoryDao } from "./StoryDao";
import { UserDao } from "./UserDao";


export interface DaoFactory {
    getAuthTokenDao(): AuthTokenDao;
    getFeedDao(): FeedDao;
    getFollowDao(): FollowDao;
    getStoryDao(): StoryDao;
    getUserDao(): UserDao;
}