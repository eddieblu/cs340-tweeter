import { useNavigate } from "react-router";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { UserInfoPresenter, UserInfoView } from "../../presenter/UserInfoPresenter";
import { useRef } from "react";


export const useNavigateToUser = () => {
    const { displayErrorMessage } = useMessageActions();
    const { displayedUser, authToken } = useUserInfo();
    const { setDisplayedUser } = useUserInfoActions();

    const navigate = useNavigate();

    const listener: UserInfoView = {
        displayErrorMessage,
        setDisplayedUser,
        navigate,
        displayInfoMessage: () => "", // empty stub to reuse UserInfoPresenter because method not needed here
        deleteMessage: () => { }, // ""
        setIsLoading: () => { }, // ""
    }

    const presenterRef = useRef<UserInfoPresenter | null>(null);
    if (!presenterRef.current) {
        presenterRef.current = new UserInfoPresenter(listener);
    }

    const navigateToUser = async (event: React.MouseEvent, featurePath: string): Promise<void> => {
        event.preventDefault();
        presenterRef.current!.navigateToUser(event.target.toString(), featurePath, authToken!, displayedUser!);
    };

    return { navigateToUser };
};