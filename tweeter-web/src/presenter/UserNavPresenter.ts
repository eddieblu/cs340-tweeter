import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { View, Presenter } from "./Presenter";

export interface UserNavView extends View {
  setDisplayedUser: (user: User) => void;
  navigate: (user: string) => void;
}

export class UserNavPresenter extends Presenter<UserNavView> {
  private service: UserService = new UserService();

  public async navigateToUser(
    targetString: string,
    featurePath: string,
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(targetString);

      const toUser = await this.service.getUser(authToken!, alias!);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    }, "get user");
  }

  public extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return this.service.getUser(authToken, alias);
  }
}
