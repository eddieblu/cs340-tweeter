import { User } from "tweeter-shared";
import UserItem from "../userItem/UserItem";
import { UserItemPresenter } from "../../presenter/UserItemPresenter";
import { PagedItemView } from "../../presenter/PagedItemPresenter";
import { ItemScroller } from "./ItemScroller";

interface Props {
  featureUrl: string;
  presenterFactory: (view: PagedItemView<User>) => UserItemPresenter;
}

const UserItemScroller = (props: Props) => (
  <ItemScroller<User, UserItemPresenter>
    featureUrl={props.featureUrl}
    presenterFactory={props.presenterFactory}
    itemFactory={(item, featureUrl) => (
      <UserItem user={item} featurePath={featureUrl} />
    )}
  />
);

export default UserItemScroller;
