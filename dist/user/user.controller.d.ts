import { IUser } from '../interfaces';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UsersService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UsersService);
    getMe({ email }: IUser): Promise<any>;
    listOrgUsers(user: IUser): Promise<any[]>;
    getUser(id: string, currentUser: IUser): Promise<any>;
    createUser(dto: CreateUserDto, currentUser: IUser): Promise<any>;
    updateUser(id: string, dto: UpdateUserDto, currentUser: IUser): Promise<any>;
    deleteUser(id: string, currentUser: IUser): Promise<{
        message: string;
    }>;
}
