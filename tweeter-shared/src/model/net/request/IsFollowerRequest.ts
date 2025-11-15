import { TweeterRequest } from "./TweeterRequest";

export interface IsFollowerRequest extends TweeterRequest {
    readonly token: string;
    readonly userAlias: string;
    readonly selectedUserAlias: string;
}
