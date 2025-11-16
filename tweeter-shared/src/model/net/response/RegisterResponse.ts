import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface RegisterResponse extends TweeterResponse {
    user: UserDto;
    authToken: AuthTokenDto;
}