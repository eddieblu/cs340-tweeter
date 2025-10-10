import { Status, AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface StatusItemView {
    addItems: (items: Status[]) => void;
    displayErrorMessage: (message: string) => void;
}

export abstract class StatusItemPresenter {
    private _view: StatusItemView;
    private userService: UserService;

    private _hasMoreItems = true;
    private _lastItem: Status | null = null;

    public constructor(view: StatusItemView) {
        this._view = view;
        this.userService = new UserService();
    }

    protected get view() { return this._view; }

    protected get lastItem() { return this._lastItem; }

    protected set lastItem(item: Status | null) { this._lastItem = item; }
    
    public get hasMoreItems() { return this._hasMoreItems; }

    protected set hasMoreItems(value: boolean) { this._hasMoreItems = value; }

    public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;

    reset() {
        this._lastItem = null;
        this._hasMoreItems = true;
    }

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        return this.userService.getUser(authToken, alias);
    };
}