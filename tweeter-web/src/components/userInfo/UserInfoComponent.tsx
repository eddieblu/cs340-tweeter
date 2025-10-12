import "./UserInfoComponent.css";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "./UserInfoHooks";
import { UserInfoPresenter, UserInfoView } from "../../presenter/UserInfoPresenter";

const UserInfo = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { displayInfoMessage, displayErrorMessage, deleteMessage } = useMessageActions();

  const { currentUser, authToken, displayedUser } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const location = useLocation();

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  const listener: UserInfoView = {
    displayErrorMessage,
    displayInfoMessage,
    deleteMessage,
    setDisplayedUser,
    navigate: (currentUserAlias) => navigate(`${getBaseUrl()}/${currentUserAlias}`),
    setIsLoading,
  }

  const presenterRef = useRef<UserInfoPresenter | null>(null); 
  if (!presenterRef.current) {
    presenterRef.current = new UserInfoPresenter(listener);
  }

  useEffect(() => {
    setIsFollowerStatus(authToken!, currentUser!, displayedUser!);
    setNumFollowees(authToken!, displayedUser!);
    setNumFollowers(authToken!, displayedUser!);
  }, [displayedUser]);
  
  const getBaseUrl = (): string => {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };
  
  const setIsFollowerStatus = async (authToken: AuthToken, currentUser: User, displayedUser: User) => {
    presenterRef.current!.setIsFollowerStatus(authToken!, currentUser!, displayedUser!);
  };

  const setNumFollowees = async (authToken: AuthToken, displayedUser: User) => {
    presenterRef.current!.setNumFollowees(authToken!, displayedUser!);
  };

  const setNumFollowers = async (authToken: AuthToken, displayedUser: User) => {
    presenterRef.current!.setNumFollowers(authToken!, displayedUser!);
  };

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault(); // keep React code in the component 
    presenterRef.current!.switchToLoggedInUser(currentUser!);
  };

  const followDisplayedUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault(); // keep React code in the component 
    presenterRef.current!.followDisplayedUser(authToken!, displayedUser!);
  };

  const unfollowDisplayedUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault(); // keep React code in the component 
    presenterRef.current!.unfollowDisplayedUser(authToken!, displayedUser!);
  };

  return (
    <>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {!displayedUser.equals(currentUser) && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={`./${currentUser.alias}`}
                    onClick={switchToLoggedInUser}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {presenterRef.current!.followeeCount > -1 && presenterRef.current!.followerCount > -1 && (
                <div>
                  Followees: {presenterRef.current!.followeeCount} Followers: {presenterRef.current!.followerCount}
                </div>
              )}
            </div>
            <form>
              {!displayedUser.equals(currentUser) && (
                <div className="form-group">
                  {presenterRef.current!.isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={unfollowDisplayedUser}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={followDisplayedUser}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Follow</div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
