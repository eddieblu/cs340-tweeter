import {
  instance,
  mock,
  verify,
} from "@typestrong/ts-mockito";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";

library.add(fab);

describe("Login", () => {
  // vars

  beforeEach(() => {
    // setup
  });

  it("starts with the sign in button disabled", async () => {
    const { signInButton } = renderLoginAndGetElement("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables the sign in button if both alias and password fields have text", async () => {
    const { user, signInButton, aliasField, passwordField } =
      renderLoginAndGetElement("/");

    await fillLoginFields(user, aliasField, passwordField);
    expect(signInButton).toBeEnabled();
  });

  it("disables the sign in button if either the alias or password fields is cleared", async () => {
    const { user, signInButton, aliasField, passwordField } =
      renderLoginAndGetElement("/");

    await fillLoginFields(user, aliasField, passwordField);
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "myalias");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenter's login method with correct parameters when the sign-in button is pressed", async () => {
    // notes
    // in order to verify, we need a mock presenter
    // login component makes its own presenter internally
    // with the mock services, we wrote a get method and used a spy that stubs the get method to return our mock presenter
    // however, we can't do that here...
    // because components are functions not classes
    // instead we can use an optional prop to pass in a presenter

    const mockPresenter = mock<LoginPresenter>();
    // mock for stubbing and verifying
    // instance to pass in to the login component
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "http://original-url.com";
    const alias = "myalias";
    const password = "mypassword";

    const { user, signInButton, aliasField, passwordField, rememberMe } =
      renderLoginAndGetElement(originalUrl, mockPresenterInstance);

    await fillLoginFields(user, aliasField, passwordField, alias, password);

    await user.click(rememberMe); // TODO: do I need to test both with and without remember me?
    await user.click(signInButton);

    verify(mockPresenter.doLogin(alias, password, true)).once();
  });
});

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  );
}

function renderLoginAndGetElement(
  originalUrl: string,
  presenter?: LoginPresenter
) {
  // calling renderLogin to have a component that's rendered
  // references to its elements
  // reference to a user that can interact with those elements
  const user = userEvent.setup();
  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");
  const rememberMe = screen.getByRole("checkbox", { name: /remember me/i });
    
  return { user, signInButton, aliasField, passwordField, rememberMe };
}

async function fillLoginFields(
  user: ReturnType<typeof userEvent.setup>,
  aliasField: HTMLElement,
  passwordField: HTMLElement,
  alias = "myalias",
  password = "mypassword"
) {
  await user.type(aliasField, alias);
  await user.type(passwordField, password);
}

// notes
// unit tests only test the individual component
// not the presenter

// when testing a component, the first thing you want to do is render the component just like a browser would
// that is what the render function does from react-testing-library

// the login component is rendered in a router, so it can't just:
// function renderLogin(originalUrl: string) {
//     return render(<Login />);
// }
// there is router functionlity that the component needs

// Routers
// when writing a web app, typically use browser router component
// manages browser history and URL
// browser router expects to be able to interact with the browser to update history
// in a test, we don't have a browser, so we use memory router instead
// memory router keeps the route information internaly
// a route is every time a different URL is clicked on or loaded

// when testing, we're not just rendering the component,
// but also simulating user interactions --> reference to the sign in button
