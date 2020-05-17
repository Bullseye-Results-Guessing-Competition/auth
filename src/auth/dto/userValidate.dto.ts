import { UserRole } from "src/users/user-role.enum";

export class UserValidateDto {
        id: number;
        username: string;
        email: string;
        role: UserRole;
}
