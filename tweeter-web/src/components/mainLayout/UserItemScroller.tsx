import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { User } from "tweeter-shared";
import { useParams } from "react-router-dom";
import UserItem from "../userItem/UserItem";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { UserItemPresenter, UserItemView } from "../../presenter/UserItemPresenter";

interface Props {
    featureUrl: string;
    presenterFactory: (view: UserItemView) => UserItemPresenter;
}

const UserItemScroller = (props: Props) => {
    const { displayErrorMessage } = useMessageActions();
    const [items, setItems] = useState<User[]>([]);

    const { displayedUser, authToken } = useUserInfo();
    const { setDisplayedUser } = useUserInfoActions();
    const { displayedUser: displayedUserAliasParam } = useParams();

    const listener: UserItemView = {
        addItems: (newItems: User[]) =>
            setItems((previousItems) => [...previousItems, ...newItems]),
        displayErrorMessage: displayErrorMessage
    }

    const presenterRef = useRef<UserItemPresenter | null>(null);
    if (!presenterRef.current) {
        presenterRef.current = props.presenterFactory(listener);
    }
    // Update the displayed user context variable whenever the displayedUser url parameter changes. 
    // This allows browser forward and back buttons to work correctly.
    useEffect(() => {
        if (
            authToken &&
            displayedUserAliasParam &&
            displayedUserAliasParam != displayedUser!.alias
        ) {
            presenterRef.current!.getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
                if (toUser) {
                    setDisplayedUser(toUser);
                }
            });
        }
    }, [displayedUserAliasParam]);

    // Initialize the component whenever the displayed user changes
    useEffect(() => {
        reset();
        loadMoreItems();
    }, [displayedUser]);

    const reset = async () => {
        setItems(() => []);
        presenterRef.current!.reset();
    };

    const loadMoreItems = async () => {
        presenterRef.current!.loadMoreItems(authToken!, displayedUser!.alias);
    };

    return (
        <div className="container px-0 overflow-visible vh-100">
            <InfiniteScroll
                className="pr-0 mr-0"
                dataLength={items.length}
                next={loadMoreItems}
                hasMore={presenterRef.current!.hasMoreItems}
                loader={<h4>Loading...</h4>}
            >
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="row mb-3 mx-0 px-0 border rounded bg-white"
                    >
                        <UserItem user={item} featurePath={props.featureUrl} />
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    );
};

export default UserItemScroller;

// notes
// in model view presenter, each view only has one presenter
// presenter is like the brain for the component
// presenters can reference multiple services but views shouldn't reference multiple presenters

//  notes for const listener: UserItemView = {
// this function will be able to access the elements of this component
// the same as implementing the interface as if this were a class
// make the views as dumb as possible and pass it all off to the presenter
// the function is the view so this object is a listener

// notes for useRef
// has one of the properties of useState
// a var you create with useRef won't use its value when you re-render but won't trigger a re-render