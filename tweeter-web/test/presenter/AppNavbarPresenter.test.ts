import { AuthToken, User } from "tweeter-shared";
import {
  AppNavbarPresenter,
  AppNavbarView,
} from "../../src/presenter/AppNavbarPresenter";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { UserService } from "../../src/model/service/UserService";
describe("AppNavbarPresenter", () => {
  let mockAppNavbarView: AppNavbarView;
  let appNavbarPresenter: AppNavbarPresenter;
  let mockService: UserService;

  const authToken = new AuthToken("auth-token", Date.now());

  beforeEach(() => {
    mockAppNavbarView = mock<AppNavbarView>();
    const mockAppNavbarViewInstance = instance(mockAppNavbarView);
    when(mockAppNavbarView.displayInfoMessage(anything(), 0)).thenReturn(
      "messageId123"
    );

    const appNavbarPresenterSpy = spy(
      new AppNavbarPresenter(mockAppNavbarViewInstance)
    );
    appNavbarPresenter = instance(appNavbarPresenterSpy);

    mockService = mock<UserService>();
    when(appNavbarPresenterSpy.service).thenReturn(instance(mockService));
  });

  /* Correct Behaviour: Logging Out */
  it("tells the view to display a logging out message", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockAppNavbarView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockService.logout(authToken)).once();

    let [capturedAuthToken] = capture(mockService.logout).last();
    expect(capturedAuthToken).toBe(authToken);
  });

  /* Correct Behaviour: Logging Out Successful */
  it(
    "on success: tells the view to clear the info message that was displayed previously," +
      "clears the user info, and navigates to the login page",
    async () => {
      await appNavbarPresenter.logOut(authToken);

      verify(mockAppNavbarView.deleteMessage("messageId123")).once();
      verify(mockAppNavbarView.clearUserInfo()).once();
      verify(mockAppNavbarView.navigateToUrl("/login")).once();

      verify(mockAppNavbarView.displayErrorMessage(anything())).never();
    }
  );

  /* Correct Behaviour: Logging Out Unsuccessful */
  it("on failure: tells the view to display an error message when logout unsuccessful", async () => {
    let error = new Error("An error occured");
    when(mockService.logout(anything())).thenReject(error);

    await appNavbarPresenter.logOut(authToken);

    verify(
      mockAppNavbarView.displayErrorMessage(
        `Failed to log user out because of exception: An error occured`
      )
    ).once();
    verify(mockAppNavbarView.deleteMessage(anything())).never();
    verify(mockAppNavbarView.clearUserInfo()).never();
    verify(mockAppNavbarView.navigateToUrl("/login")).never();
  });
});

// notes
// use mocks and spies to stub and verify
// use instances created from them everywhere else
