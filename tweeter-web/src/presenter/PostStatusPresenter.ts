import { AuthToken, User, Status } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  setIsLoading: (value: boolean) => void;
  setPost: (value: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _service: StatusService= new StatusService();

  public get service(): StatusService {
    return this._service;
  }

  public async submitPost(authToken: AuthToken, post: string, user: User) {
    var postingStatusToastId = "";

    this.view.setIsLoading(true);
    postingStatusToastId = this.view.displayInfoMessage("Posting status...", 0);

    await this.doFailureReportingOperation(
      async () => {
        const status = new Status(post, user, Date.now());

        await this.service.postStatus(authToken!, status);

        this.view.setPost(""); // sets the input field text box to empty once you create your post
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post the status",
      () => {
        this.view.deleteMessage(postingStatusToastId);
        this.view.setIsLoading(false);
      }
    );
  }

  public clearPost() {
    this.view.setPost("");
  }

  public isButtonDisabled(
    post: string,
    authToken: AuthToken,
    user: User
  ): boolean {
    return !post.trim() || !authToken || !user;
  }
}
