import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";


export interface UserNavView {
    displayErrorMessage: (message: string) => void;
    setDisplayedUser: (user: User) => void;
    navigate: (user: string) => void;
}

export class UserNavPresenter {
    private view: UserNavView;
    private service: UserService;

    public constructor(view: UserNavView) {
        this.view = view;
        this.service = new UserService();
    }

    public async navigateToUser(targetString: string, featurePath: string, authToken: AuthToken, displayedUser: User): Promise<void> {
        try {
            const alias = this.extractAlias(targetString);

            const toUser = await this.service.getUser(authToken!, alias!);

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
        return this.service.getUser(authToken, alias);
    };
}