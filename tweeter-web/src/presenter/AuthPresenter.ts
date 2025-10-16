import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/service/UserService";

export interface AuthView extends View {
  navigateToUrl: (url: string) => void;
  setIsLoading: (value: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
}

export class AuthPresenter<V extends AuthView> extends Presenter<V> {
  private _service: UserService = new UserService();

  protected get service() {
    return this._service;
  }
  
  protected async doAuthOperation(
    operation: () => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    operationDescription: string,
    navigateUrl?: string
  ): Promise<void> {
    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);

        const [user, authToken] = await operation();

        this.view.updateUserInfo(user, user, authToken, rememberMe);

        const url = navigateUrl ?? `/feed/${user.alias}`;
        this.view.navigateToUrl(url);
      },
      operationDescription,
      () => {
        this.view.setIsLoading(false);
      }
    );
  }
}
