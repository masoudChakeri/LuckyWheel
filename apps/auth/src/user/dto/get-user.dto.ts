import { Expose } from "class-transformer";

export class GetUserResponse {
    @Expose()   
    id: string;

    @Expose()
    phone: string;

    @Expose()
    role: string;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    inviteCode: string;
}
