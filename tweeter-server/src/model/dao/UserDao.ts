import { User } from "tweeter-shared";

export interface UserDao {
  getUser(alias: string): Promise<User | null>;

  createUser(newUser: User, passwordHash: string): Promise<void>;
  
  getPasswordHash(alias: string): Promise<string | null>;
  
  incremementFollowerCount(alias: string, delta: number): Promise<void>;
  
  incremementFolloweeCount(alias: string, delta: number): Promise<void>;
}
