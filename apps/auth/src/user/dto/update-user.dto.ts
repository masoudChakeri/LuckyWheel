import { IsOptional, IsString } from 'class-validator';
import { UserRoles } from '@app/common';


export class UpdateUserRequest {
    @IsString()
    @IsOptional()
    phone: string;

    @IsString()
    @IsOptional()
    role: UserRoles;

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    email: string;
}
