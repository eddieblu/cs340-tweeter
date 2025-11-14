import { UserDto } from "../../dto/UserDto";

export interface PagedItemUserRequest {
    readonly token: string;
    readonly userAlias: string;
    readonly pageSize: number;
    readonly lastItem: UserDto | null; // opt: readonly lastItem?: UserDto;
}