import { KeyboardEventHandler } from "react";

interface Props {
    onSubmit: () => void;
    isSubmitDisabled: () => boolean;
    setAlias: (alias: string) => void;
    setPassword: (password: string) => void;
}

const AuthenticationFields = (props: Props) => {

    const onEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !props.isSubmitDisabled()) {
      props.onSubmit();
    }
  };

    return (
        <>
            <div className="form-floating">
                <input
                    type="text"
                    className="form-control"
                    size={50}
                    id="aliasInput"
                    placeholder="name@example.com"
                    onKeyDown={onEnter}
                    onChange={(event) => props.setAlias(event.target.value)}
                />
                <label htmlFor="aliasInput">Alias</label>
            </div>
            <div className="form-floating mb-3">
                <input
                    type="password"
                    className="form-control bottom"
                    id="passwordInput"
                    placeholder="Password"
                    onKeyDown={onEnter}
                    onChange={(event) => props.setPassword(event.target.value)}
                />
                <label htmlFor="passwordInput">Password</label>
            </div>
        </>
    )
}

export default AuthenticationFields;