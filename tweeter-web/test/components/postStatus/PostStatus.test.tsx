import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { User } from "tweeter-shared/dist/model/domain/User";

import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import { PostStatus } from "../../../src/components/postStatus/PostStatus";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";

import { instance, mock, reset, verify, when } from "@typestrong/ts-mockito";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// import { library } from "@fortawesome/fontawesome-svg-core";
// import { fab } from "@fortawesome/free-brands-svg-icons";

// library.add(fab);

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("Post Status", () => {
  const currentUser = new User("Alice", "Anderson", "@alice", "");
  const authToken = new AuthToken("auth-token", Date.now());

  const mockPresenter = mock<PostStatusPresenter>();
  const mockPresenterInstance = instance(mockPresenter);

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: currentUser,
      authToken: authToken,
    });
  });

  beforeEach(() => {
    // resets the presenter mock before every test 
    // and re-establishes its expected behavior
    // so that leftover state from one test doesn't affect another
    
    reset(mockPresenter);
    // Basic enable/disable behavior to satisfy component checks
    when(mockPresenter.isButtonDisabled("", authToken, currentUser)).thenReturn(true);
    when(mockPresenter.isButtonDisabled("x", authToken, currentUser)).thenReturn(
      false
    );
  });

  it("starts with the post status and clear buttons disabled", () => {
    const { postButton, clearButton } = renderPostStatusAndGetElement(
      mockPresenterInstance
    );

    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables the post status and clear buttons when the text field has text", async () => {
    const { userInput, textArea, postButton, clearButton } =
      renderPostStatusAndGetElement(mockPresenterInstance);

    await userInput.type(textArea, "x");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables the post status and clear buttons when the text field is cleared", async () => {
    const { userInput, textArea, postButton, clearButton } =
      renderPostStatusAndGetElement(mockPresenterInstance);

    await userInput.type(textArea, "x");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await userInput.clear(textArea);
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenter's postStatus method with correct parameters when the post status button is pressed", async () => {
    const { userInput, textArea, postButton, clearButton } =
      renderPostStatusAndGetElement(mockPresenterInstance);

    const postText = "Hello!";
    await userInput.type(textArea, postText);
    await userInput.click(postButton);

    verify(mockPresenter.submitPost(authToken, postText, currentUser)).once();
  });
});

// helper functions

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(<PostStatus presenter={presenter} />);
}

function renderPostStatusAndGetElement(presenter?: PostStatusPresenter) {
  const userInput = userEvent.setup();
  renderPostStatus(presenter);

  const textArea = screen.getByLabelText(/post status text/i);
  const postButton = screen.getByRole("button", { name: /post status/i });
  const clearButton = screen.getByRole("button", { name: /clear/i });

  return { userInput, textArea, postButton, clearButton };
}
