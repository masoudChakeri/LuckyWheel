import { Expose, Type } from "class-transformer";
import { GetUserResponse } from "./get-user.dto";

export class GetAllUsersResponse {
    @Expose()
    @Type(() => GetUserResponse)
    users: GetUserResponse[];

    @Expose()
    meta: {
        itemCount: number;
        totalPages: number;
        currentPage: number;
    }
}