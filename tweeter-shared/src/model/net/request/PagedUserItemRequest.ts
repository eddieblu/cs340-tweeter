import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface PagedUserItemRequest extends TweeterRequest {
    readonly token: string;
    readonly userAlias: string;
    readonly pageSize: number;
    readonly lastItem: UserDto | null; 
}

// TODO: refactor with generic PagedItemRequest<T> for User and Status items