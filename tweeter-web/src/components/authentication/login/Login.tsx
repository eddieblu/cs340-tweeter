import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { LoginView, LoginPresenter } from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const listener: LoginView = {
    displayErrorMessage,
    navigateToUrl: (url) => navigate(url),
    setIsLoading,
    updateUserInfo
  }
  const presenterRef = useRef<LoginPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new LoginPresenter(listener);
  }

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };
  const isSubmitDisabled = checkSubmitButtonStatus();

  const doLogin = async () => {
    await presenterRef.current!.doLogin(alias, password, rememberMe);
  };

  const inputFieldFactory = () => (
    <AuthenticationFields
      onSubmit={doLogin}
      isSubmitDisabled={isSubmitDisabled}
      setAlias={setAlias}
      setPassword={setPassword} />
  );

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      isSubmitDisabled={isSubmitDisabled}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;


// notes
// props is greyed out and says: 'props' is declared but its value is never read.
// however, it is used in App.tsx as an IntrinsicAttribute of Login.tsx --> so keep it!