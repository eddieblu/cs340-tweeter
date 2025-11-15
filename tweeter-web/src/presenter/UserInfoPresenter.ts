import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { UserService } from "../model/service/UserService";
import { Presenter, MessageView } from "./Presenter";

export interface UserInfoView extends MessageView {
  setDisplayedUser: (user: User) => void;
  navigate: (user: string) => void;
  setIsLoading: (value: boolean) => void;
  setFolloweeCount(count: number): void;
  setFollowerCount(count: number): void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: FollowService = new FollowService();
  private userService: UserService = new UserService();

  private _isFollower = false;
  private _followeeCount = -1;
  private _followerCount = -1;

  get isFollower(): boolean {
    return this._isFollower;
  }
  get followeeCount(): number {
    return this._followeeCount;
  }
  get followerCount(): number {
    return this._followerCount;
  }

  async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ): Promise<void> {
    if (currentUser.equals(displayedUser)) {
      this._isFollower = false;
      return;
    }
    await this.doFailureReportingOperation(async () => {
      this._isFollower = await this.service.getIsFollowerStatus(
        authToken,
        currentUser,
        displayedUser
      );
    }, "determine follower status");
  }

  async setNumFollowees(authToken: AuthToken, displayedUser: User): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const count = await this.service.getFolloweeCount(
        authToken,
        displayedUser
      );
      this._followeeCount = count;
      this.view.setFolloweeCount(count);
    }, "get followee count");
  }

  async setNumFollowers(authToken: AuthToken, displayedUser: User): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const count = await this.service.getFollowerCount(
        authToken,
        displayedUser
      );
      this._followerCount = count;
      this.view.setFollowerCount(count);
    }, "get follower count");
  }

  switchToLoggedInUser(loggedInUser: User): void {
    this.view.setDisplayedUser(loggedInUser!);
    this.view.navigate(loggedInUser.alias);
  }

  async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    this.doFollowAction("follow", authToken, displayedUser);
  }

  async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    this.doFollowAction("unfollow", authToken, displayedUser);
  }

  private async doFollowAction(
    action: "follow" | "unfollow",
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    this.view.setIsLoading(true);

    const toastMessage = this.view.displayInfoMessage(
      `${action === "follow" ? "Following" : "Unfollowing"} ${
        displayedUser.name
      }...`,
      0
    );

    await this.doFailureReportingOperation(
      async () => {
        const [numFollowers, numFollowees] =
          action === "follow"
            ? await this.service.follow(authToken, displayedUser)
            : await this.service.unfollow(authToken, displayedUser);

        this._isFollower = action === "follow";
        this._followerCount = numFollowers;
        this._followeeCount = numFollowees;
        this.view.setFollowerCount(numFollowers);
        this.view.setFolloweeCount(numFollowees);
      },
      `${action} user`,
      () => {
        this.view.deleteMessage(toastMessage);
        this.view.setIsLoading(false);
      }
    );
  }
}
