import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@server/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async signIn(username: string, pass: string){
        const user = await this.usersService.find(username);
        if (!user){
            console.log("User not Found");
            throw new UnauthorizedException(); //user not found
        }
        //password check
        const passwordMatch = await bcrypt.compare(pass, user.password);
        if (!passwordMatch) {
            console.log("Incorrect Password");
            throw new UnauthorizedException(); //incorrect password
        }
        //const {password, ...result } = user;
        //get jwt token
        const payload = {sub: user.id, username: user.username};
        const accessToken = await this.jwtService.signAsync(payload);
        //returns the user object.
        return accessToken;
    }
}
