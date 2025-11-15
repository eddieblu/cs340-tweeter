import { UserDto } from "./UserDto";
import { PostSegmentDto } from "./PostSegmentDto";

export interface StatusDto {
  readonly post: string;
  readonly user: UserDto;
  readonly timestamp: number;
  readonly segments: PostSegmentDto[];
}