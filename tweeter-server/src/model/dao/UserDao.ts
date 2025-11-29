import { User } from "tweeter-shared";

export interface UserDao {
  getUser(alias: string): Promise<User | null>;

  createUser(newUser: User, passwordHash: string): Promise<void>;
  
  getPasswordHash(alias: string): Promise<string | null>;
  
  incrementFollowerCount(alias: string, delta: number): Promise<void>;
  
  incrementFolloweeCount(alias: string, delta: number): Promise<void>;

  getFollowerCount(alias: string): Promise<number>;

  getFolloweeCount(alias: string): Promise<number>;
}
