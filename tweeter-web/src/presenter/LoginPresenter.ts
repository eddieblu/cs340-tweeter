import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
  navigateToUrl: (url: string) => void;
  setIsLoading: (value: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
}

export class LoginPresenter extends Presenter<LoginView> {
  private service: UserService= new UserService();

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string
  ): Promise<void> {
    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await this.service.login(alias, password);

        this.view.updateUserInfo(user, user, authToken, rememberMe);

        const url = originalUrl ? originalUrl : `/feed/${user.alias}`;
        this.view.navigateToUrl(url);
      },
      "log user in",
      () => {
        this.view.setIsLoading(false);
      }
    );
  }
}
