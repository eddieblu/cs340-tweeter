import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserItemView {
    addItems: (items: User[]) => void;
    displayErrorMessage: (message: string) => void;
}

export abstract class UserItemPresenter {
    private _view: UserItemView;
    private userService: UserService;
    private _hasMoreItems = true;
    private _lastItem: User | null = null;

    protected constructor(view: UserItemView) {
        this._view = view;
        this.userService = new UserService();
    }

    protected get view() { return this._view; }

    protected get lastItem() { return this._lastItem; }

    protected set lastItem(item: User | null) { this._lastItem = item; }

    public get hasMoreItems() { return this._hasMoreItems; }

    protected set hasMoreItems(value: boolean) { this._hasMoreItems = value; }

    reset() {
        this._lastItem = null;
        this._hasMoreItems = true;
    }

    public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        return this.userService.getUser(authToken, alias);
    };

}