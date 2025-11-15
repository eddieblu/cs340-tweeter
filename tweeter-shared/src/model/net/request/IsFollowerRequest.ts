import { TweeterRequest } from "./TweeterRequest";

export interface IsFollowerRequest extends TweeterRequest {
    authToken: string;
    userAlias: string;
    selectedUserAlias: string;
}
