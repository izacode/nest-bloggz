// import { Injectable } from "@nestjs/common";

// import { UsersRepository } from "src/users/users.repository";


// @Injectable()
// export class JwtService {
//   constructor(
//     protected usersRepository: UsersRepository,
//     private readonly jwtService: JwtService,
//   ) {}

//   async createAccessJWT(user) {
//     const token = this.jwtService.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: process.env.JWT_EXPIRATION,
//     });
//     return token;
//   }
//   async createRefreshJWT(user) {
//     const token = this.jwtService.sign(
//       { userId: user._id },
//       process.env.REFRESH_JWT_SECRET,
//       { expiresIn: process.env.JWT_REFRESH_EXPIRATION },
//     );
//     return token;
//   }

//   async getUserIdByToken(token: string) {
//     try {
//       const result: any = this.jwtService.verify(token, process.env.JWT_SECRET);
//       return result.userId;
//     } catch (error) {
//       return null;
//     }
//   }
//   async getUserIdByRefreshToken(token: string) {
//     try {
//       const result: any = this.jwtService.verify(token, process.env.REFRESH_JWT_SECRET);

//       return result.userId;
//     } catch (error) {
//       return null;
//     }
//   }
// }



