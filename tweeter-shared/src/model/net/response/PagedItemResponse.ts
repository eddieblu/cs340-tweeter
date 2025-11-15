import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

// export interface PagedUserItemResponse extends TweeterResponse {
//     readonly items: UserDto[] | null;
//     readonly hasMore: boolean;
// }

export interface PagedItemResponse<T> extends TweeterResponse {
    readonly items: T[] | null;
    readonly hasMore: boolean;
}