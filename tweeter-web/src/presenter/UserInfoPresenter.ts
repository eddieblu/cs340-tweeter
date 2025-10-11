import { AuthToken, User, FakeData } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";


export interface UserInfoView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => string;
    deleteMessage: (messageId: string) => void;
    setDisplayedUser: (user: User) => void;
    navigateToUserPage: (user: string) => void;
    setIsLoading: (value: boolean) => void;
}

export class UserInfoPresenter {
    private view: UserInfoView;
    private service: FollowService;

    private _isFollower = false;
    private _followeeCount: number = 0;
    private _followerCount: number = 0;


    public constructor(view: UserInfoView) {
        this.view = view;
        this.service = new FollowService();
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
        this.view.navigateToUserPage(currentUser.alias);
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


}