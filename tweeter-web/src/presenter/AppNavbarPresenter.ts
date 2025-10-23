import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, MessageView } from "./Presenter";

export interface AppNavbarView extends MessageView {
  clearUserInfo: () => void;
  navigateToUrl: (url: string) => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
  private _service: UserService = new UserService();

  public get service(): UserService {
    return this._service;
  }

  public async logOut(authToken: AuthToken): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const loggingOutToastId = this.view.displayInfoMessage(
        "Logging Out...",
        0
      );

      await this.service.logout(authToken!);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigateToUrl("/login");
    }, "log user out");
  }
}
