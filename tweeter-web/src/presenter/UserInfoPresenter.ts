import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { UserService } from "../model.service/UserService";


export interface UserInfoView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => string;
    deleteMessage: (messageId: string) => void;
    setDisplayedUser: (user: User) => void;
    navigate: (user: string) => void;
    setIsLoading: (value: boolean) => void;
}

export class UserInfoPresenter {
    private view: UserInfoView;
    private service: FollowService;
    private userService: UserService;

    private _isFollower = false;
    private _followeeCount = 0;
    private _followerCount = 0;


    public constructor(view: UserInfoView) {
        this.view = view;
        this.service = new FollowService();
        this.userService = new UserService();
    }

    public get isFollower() { return this._isFollower; }
    public get followeeCount() { return this._followeeCount; }
    public get followerCount() { return this._followerCount; }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        try {
            if (currentUser === displayedUser) {
                this._isFollower = false;
            } else {
                this._isFollower = await this.service.getIsFollowerStatus(authToken, currentUser, displayedUser);
            }
        } catch (error) {
            this.view.displayErrorMessage(`Failed to determine follower status because of exception: ${error}`,);
        }
    };

    public async setNumFollowees(
        authToken: AuthToken,
        displayedUser: User
    ) {
        try {
            this._followeeCount = await this.service.getFolloweeCount(authToken, displayedUser);
        } catch (error) {
            this.view.displayErrorMessage(`Failed to get followees count because of exception: ${error}`,);
        }
    };

    public async setNumFollowers(
        authToken: AuthToken,
        displayedUser: User
    ) {
        try {
            this._followerCount = await this.service.getFollowerCount(authToken, displayedUser);
        } catch (error) {
            this.view.displayErrorMessage(`Failed to get followers count because of exception: ${error}`,);
        }
    };

    public async switchToLoggedInUser(currentUser: User): Promise<void> {
        this.view.setDisplayedUser(currentUser!);
        this.view.navigate(currentUser.alias);
    };

    public async followDisplayedUser(authToken: AuthToken, displayedUser: User): Promise<void> {
        var followingUserToast = "";

        try {
            this.view.setIsLoading(true);
            followingUserToast = this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

            const [numFollowers, numFollowees] = await this.service.follow(authToken, displayedUser);

            this._isFollower = true;
            this._followerCount = numFollowers;
            this._followeeCount = numFollowees;
        } catch (error) {
            this.view.displayErrorMessage(`Failed to follow user because of exception: ${error}`,);
        } finally {
            this.view.deleteMessage(followingUserToast);
            this.view.setIsLoading(false);
        }
    };

    public async unfollowDisplayedUser(authToken: AuthToken, displayedUser: User): Promise<void> {
        var unfollowingUserToast = "";

        try {
            this.view.setIsLoading(true);
            unfollowingUserToast = this.view.displayInfoMessage(`Unfollowing ${displayedUser!.name}...`, 0);

            const [numFollowers, numFollowees] = await this.service.unfollow(
                authToken!,
                displayedUser!
            );

            this._isFollower = false;
            this._followerCount = numFollowers;
            this._followeeCount = numFollowees;
        } catch (error) {
            this.view.displayErrorMessage(`Failed to unfollow user because of exception: ${error}`,);
        } finally {
            this.view.deleteMessage(unfollowingUserToast);
            this.view.setIsLoading(false);
        }
    };

    public async navigateToUser(targetString: string, featurePath: string, authToken: AuthToken, displayedUser: User): Promise<void> {
        try {
            const alias = this.extractAlias(targetString);

            const toUser = await this.userService.getUser(authToken!, alias!);

            if (toUser) {
                if (!toUser.equals(displayedUser!)) {
                    this.view.setDisplayedUser(toUser);
                    this.view.navigate(`${featurePath}/${toUser.alias}`);
                }
            }
        } catch (error) {
            this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`,);
        }
    };

    public extractAlias(value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    };

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        return this.userService.getUser(authToken, alias);
    };
}