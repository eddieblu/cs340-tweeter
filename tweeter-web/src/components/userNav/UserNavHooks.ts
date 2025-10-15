import { useNavigate } from "react-router";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { useRef } from "react";
import { UserNavPresenter, UserNavView } from "../../presenter/UserNavPresenter";


export const useNavigateToUser = () => {
    const { displayErrorMessage } = useMessageActions();
    const { displayedUser, authToken } = useUserInfo();
    const { setDisplayedUser } = useUserInfoActions();

    const navigate = useNavigate();

    const listener: UserNavView = {
        displayErrorMessage,
        setDisplayedUser,
        navigate,
    }

    const presenterRef = useRef<UserNavPresenter | null>(null);
    if (!presenterRef.current) {
        presenterRef.current = new UserNavPresenter(listener);
    }

    const navigateToUser = async (event: React.MouseEvent, featurePath: string): Promise<void> => {
        event.preventDefault();
        presenterRef.current!.navigateToUser(event.target.toString(), featurePath, authToken!, displayedUser!);
    };

    return { navigateToUser };
};