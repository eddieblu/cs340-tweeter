import { TweeterRequest } from "./TweeterRequest";

export interface GetFollowCountRequest extends TweeterRequest {
    readonly token: string;
    readonly userAlias: string;
}
