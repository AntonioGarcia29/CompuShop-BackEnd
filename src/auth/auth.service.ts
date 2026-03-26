import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async googleLogin(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateGoogleUser(profile: {
    email: string;
    name: string;
    picture: string;
    googleId: string;
  }) {
    try {
      return await this.usersService.findByEmail(profile.email);
    } catch {
      return await this.usersService.create({
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
        googleId: profile.googleId,
      });
    }
  }

  async getProfile(id: string) {
    return this.usersService.findOne(id);
  }
}
