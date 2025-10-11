import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface AppNavbarView {
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => string;
    displayErrorMessage: (message: string, bootstrapClasses?: string | undefined) => string;
    deleteMessage: (messageId: string) => void;
    clearUserInfo: () => void;
    navigateToUrl: (url: string) => void;
}

export class AppNavbarPresenter {
    private view: AppNavbarView;
    private service: UserService;

    constructor(view: AppNavbarView) {
        this.view = view;
        this.service = new UserService();
    }

    public async logOut(authToken: AuthToken): Promise<void> {
        const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

        try {
            await this.logout(authToken!);

            this.view.deleteMessage(loggingOutToastId);
            this.view.clearUserInfo();
            this.view.navigateToUrl("/login");
        } catch (error) {
            this.view.displayErrorMessage(`Failed to log user out because of exception: ${error}`);
        }
    };

    public async logout(authToken: AuthToken): Promise<void> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        await this.service.logout(authToken)
    };
}