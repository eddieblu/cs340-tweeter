import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { UserService } from "../model/service/UserService";
import { Presenter, MessageView } from "./Presenter";

export interface UserInfoView extends MessageView {
  setDisplayedUser: (user: User) => void;
  navigate: (user: string) => void;
  setIsLoading: (value: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: FollowService = new FollowService();
  private userService: UserService = new UserService();

  private _isFollower = false;
  private _followeeCount = 0;
  private _followerCount = 0;

  public get isFollower() {
    return this._isFollower;
  }
  public get followeeCount() {
    return this._followeeCount;
  }
  public get followerCount() {
    return this._followerCount;
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this._isFollower = false;
      } else {
        this._isFollower = await this.service.getIsFollowerStatus(
          authToken,
          currentUser,
          displayedUser
        );
      }
    }, "determine follower status");
  }

  public async setNumFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this._followeeCount = await this.service.getFolloweeCount(
        authToken,
        displayedUser
      );
    }, "get followees count");
  }

  public async setNumFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this._followerCount = await this.service.getFollowerCount(
        authToken,
        displayedUser
      );
    }, "get followers count");
  }

  public async switchToLoggedInUser(currentUser: User): Promise<void> {
    this.view.setDisplayedUser(currentUser!);
    this.view.navigate(currentUser.alias);
  }

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    this.handleFollowAction("follow", authToken, displayedUser);
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    this.handleFollowAction("unfollow", authToken, displayedUser);
  }

  public async navigateToUser(
    targetString: string,
    featurePath: string,
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(targetString);

      const toUser = await this.userService.getUser(authToken!, alias!);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    }, "get user");
  }

  public extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  }

  private async handleFollowAction(
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
      },
      `${action} user`,
      () => {
        this.view.deleteMessage(toastMessage);
        this.view.setIsLoading(false);
      }
    );
  }
}
