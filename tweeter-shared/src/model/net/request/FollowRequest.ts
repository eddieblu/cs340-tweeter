import { TweeterRequest } from "./TweeterRequest";

export interface FollowRequest extends TweeterRequest {
    readonly token: string;
    readonly userToFollowAlias: string;
}