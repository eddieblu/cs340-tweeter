import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface LoginView extends AuthView {}

export class LoginPresenter extends AuthPresenter<LoginView> {
  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string
  ): Promise<void> {
    await this.doAuthOperation(
      () => this.service.login(alias, password),
      rememberMe,
      "log user in",
      originalUrl
    );
  }
}
