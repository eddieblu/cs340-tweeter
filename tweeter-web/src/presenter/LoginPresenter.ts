import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface LoginView {
    displayErrorMessage: (message: string, bootstrapClasses?: string,) => string,
    navigateToUrl: (url: string) => void;
    setIsLoading: (value: boolean) => void;
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
};

export class LoginPresenter {
    private view: LoginView;
    private service: UserService;

    constructor(view: LoginView) {
        this.view = view;
        this.service = new UserService();
    };

    public async doLogin(
        alias: string,
        password: string,
        rememberMe: boolean,
        originalUrl?: string
    ): Promise<void> {
        try {
            this.view.setIsLoading(true);

            const [user, authToken] = await this.service.login(alias, password);

            this.view.updateUserInfo(user, user, authToken, rememberMe);

            const url = originalUrl ? originalUrl : `/feed/${user.alias}`;
            this.view.navigateToUrl(url);

        } catch (error) {
            this.view.displayErrorMessage(`Failed to log user in because of exception: ${error}`,);
        } finally {
            this.view.setIsLoading(false);
        }
    };
};