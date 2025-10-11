import { UserService } from "../model.service/UserService";

export interface RegisterView {

}

export class RegisterPresenter {
    private view: RegisterView;
    private service: UserService;

    constructor(view: RegisterView) {
        this.view = view;
        this.service = new UserService();
    }
}