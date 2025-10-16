import { Status } from "tweeter-shared";
import StatusItem from "../statusItem/StatusItem";
import { StatusItemPresenter } from "../../presenter/StatusItemPresenter";
import { PagedItemView } from "../../presenter/PagedItemPresenter";
import { ItemScroller } from "./ItemScroller";

interface Props {
  featureUrl: string;
  presenterFactory: (view: PagedItemView<Status>) => StatusItemPresenter;
}

const StatusItemScroller = (props: Props) => (
  <ItemScroller<Status, StatusItemPresenter>
    featureUrl={props.featureUrl}
    presenterFactory={props.presenterFactory}
    itemFactory={(item, featureUrl) => (
      <StatusItem status={item} featurePath={featureUrl} />
    )}
  />
);

export default StatusItemScroller;
