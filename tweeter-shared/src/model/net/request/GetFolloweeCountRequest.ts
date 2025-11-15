import { TweeterRequest } from "./TweeterRequest";

export interface GetFolloweeCountRequest extends TweeterRequest {
    readonly token: string;
    readonly userAlias: string;
}
