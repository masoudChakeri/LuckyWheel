import { Expose } from "class-transformer";

export class LoginResponse {
    @Expose()
    token: string;

    @Expose()
    user_id: string;

    @Expose()
    phone: string;

    @Expose()
    role: string;

    @Expose()
    inviteCode: string;
}
