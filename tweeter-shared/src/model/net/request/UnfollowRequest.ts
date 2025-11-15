import { TweeterRequest } from "./TweeterRequest";

export interface UnfollowRequest extends TweeterRequest {
    readonly token: string;
    readonly userToUnfollowAlias: string;
}