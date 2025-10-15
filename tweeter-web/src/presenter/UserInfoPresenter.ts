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
    var followingUserToast = "";
    this.view.setIsLoading(true);
    followingUserToast = this.view.displayInfoMessage(
      `Following ${displayedUser!.name}...`,
      0
    );

    await this.doFailureReportingOperation(
      async () => {
        const [numFollowers, numFollowees] = await this.service.follow(
          authToken,
          displayedUser
        );

        this._isFollower = true;
        this._followerCount = numFollowers;
        this._followeeCount = numFollowees;
      },
      "follow user",
      () => {
        this.view.deleteMessage(followingUserToast);
        this.view.setIsLoading(false);
      }
    );
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    var unfollowingUserToast = "";
    this.view.setIsLoading(true);
    unfollowingUserToast = this.view.displayInfoMessage(
      `Unfollowing ${displayedUser!.name}...`,
      0
    );

    await this.doFailureReportingOperation(
      async () => {
        const [numFollowers, numFollowees] = await this.service.unfollow(
          authToken!,
          displayedUser!
        );

        this._isFollower = false;
        this._followerCount = numFollowers;
        this._followeeCount = numFollowees;
      },
      "unfollow user",
      () => {
        this.view.deleteMessage(unfollowingUserToast);
        this.view.setIsLoading(false);
      }
    );
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
}
