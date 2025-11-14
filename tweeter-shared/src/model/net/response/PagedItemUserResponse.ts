import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface PagedItemUserResponse extends TweeterResponse {
    readonly items: UserDto[] | null;
    readonly hasMorePages: boolean;
}