import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface RegisterView {
    displayErrorMessage: (message: string, bootstrapClasses?: string,) => string,
    navigateToUrl: (url: string) => void;
    setIsLoading: (value: boolean) => void;
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
}

export class RegisterPresenter {
    private view: RegisterView;
    private service: UserService;

    constructor(view: RegisterView) {
        this.view = view;
        this.service = new UserService();
    }

    public checkSubmitButtonStatus(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageUrl: string,
        imageFileExtension: string
    ): boolean {
        return (
            !firstName ||
            !lastName ||
            !alias ||
            !password ||
            !imageUrl ||
            !imageFileExtension
        );
    };

    public getFileExtension(file: File): string | undefined {
        return file.name.split(".").pop();
    };

    public async doRegister(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageBytes: Uint8Array,
        imageFileExtension: string,
        rememberMe: boolean
    ) {
        try {
            this.view.setIsLoading(true);

            const [user, authToken] = await this.service.register(
                firstName,
                lastName,
                alias,
                password,
                imageBytes,
                imageFileExtension
            );

            this.view.updateUserInfo(user, user, authToken, rememberMe);
            this.view.navigateToUrl(`/feed/${user.alias}`);
        } catch (error) {
            this.view.displayErrorMessage(`Failed to register user because of exception: ${error}`,);
        } finally {
            this.view.setIsLoading(false);
        }
    };


}