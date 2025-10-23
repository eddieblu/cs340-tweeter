import { AuthToken, Status, User } from "tweeter-shared";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import { StatusService } from "../../src/model/service/StatusService";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockService: StatusService;

  const authToken = new AuthToken("auth-token", Date.now());
  const post = "hello tweeter";
  const user = new User("Alice", "Anderson", "@alice", "");

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);
    when(mockPostStatusView.displayInfoMessage(anything(), 0)).thenReturn(
      "info-message"
    ); // todo: used?

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockService = mock<StatusService>();
    when(postStatusPresenterSpy.service).thenReturn(instance(mockService));
  });

  /* Correct Behaviour: Posting */
  it("tells the view to display a posting status message", async () => {
    when(mockService.postStatus(anything(), anything())).thenResolve();

    await postStatusPresenter.submitPost(authToken, post, user);

    const [message, duration] = capture(
      mockPostStatusView.displayInfoMessage
    ).first();
    expect(message).toBe("Posting status...");
    expect(duration).toBe(0);

    verify(mockPostStatusView.setIsLoading(true)).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    when(mockService.postStatus(anything(), anything())).thenResolve();

    await postStatusPresenter.submitPost(authToken, post, user);

    verify(mockService.postStatus(anything(), anything())).once();

    const [capturedAuth, capturedStatus] = capture(
      mockService.postStatus
    ).last();

    expect(capturedAuth).toBe(authToken);
    expect(capturedStatus).toBeInstanceOf(Status);
  });

  it(
    "on success: tells the view to clear the info message that was displayed previously," +
      "clears the post, and displays a status posted message",
    async () => {
      when(mockService.postStatus(anything(), anything())).thenResolve();

      await postStatusPresenter.submitPost(authToken, post, user);

      verify(mockPostStatusView.deleteMessage("info-message")).once();
      verify(mockPostStatusView.setPost("")).once();
      verify(
        mockPostStatusView.displayInfoMessage("Status posted!", anything())
      ).once();
      verify(mockPostStatusView.setIsLoading(false)).once();
      // Should not display an error
      verify(mockPostStatusView.displayErrorMessage(anything())).never();
    }
  );

  /* Correct Behaviour: Posting Unsuccessful */
  it(
    "on failure: tells the view to clear the info message and display an error message" +
      "but does not tell it to clear the post or display a status posted message.",
    async () => {
      const err = new Error("An error occured");
      when(mockService.postStatus(anything(), anything())).thenReject(err);

      await postStatusPresenter.submitPost(authToken, post, user);

      verify(mockPostStatusView.deleteMessage("info-message")).once();
      verify(
        mockPostStatusView.displayErrorMessage(
          "Failed to post the status because of exception: An error occured"
        )
      ).once();
      verify(mockPostStatusView.setIsLoading(false)).once();

      verify(mockPostStatusView.setPost(anything())).never();
      verify(
        mockPostStatusView.displayInfoMessage("Status posted!", anything())
      ).never();
    }
  );
});
