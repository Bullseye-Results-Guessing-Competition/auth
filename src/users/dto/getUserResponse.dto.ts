import { UserRole } from "../user-role.enum";

export class GetUserResponseDto {
    username: string;
    email: string;
    role: UserRole;
  }