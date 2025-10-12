import { AuthToken, User, Status } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";

export interface PostStatusView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => string;
  deleteMessage: (messageId: string) => void;
  setIsLoading: (value: boolean) => void;
  setPost: (value: string) => void;
}

export class PostStatusPresenter {
  private view: PostStatusView;
  private service: StatusService;

  constructor(view: PostStatusView) {
    this.view = view;
    this.service = new StatusService();
  };

  public async submitPost(authToken: AuthToken, post: string, user: User) {
    var postingStatusToastId = "";

    try {
      this.view.setIsLoading(true);
      postingStatusToastId = this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, user, Date.now());

      await this.service.postStatus(authToken!, status);

      this.view.setPost(""); // sets the input field text box to empty once you create your post 
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to post the status because of exception: ${error}`,);
    } finally {
      this.view.deleteMessage(postingStatusToastId);
      this.view.setIsLoading(false);
    }
  };

  public clearPost() {
    this.view.setPost("");
  };

  public isButtonDisabled(post: string, authToken: AuthToken, user: User): boolean {
    return !post.trim() || !authToken || !user;
  };
}