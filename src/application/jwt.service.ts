import jwt from "jsonwebtoken";
import { UsersRepository } from "src/users/users.repository";



export class JwtService {
  constructor(protected usersRepository: UsersRepository) {}

  async createJWT(user) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    return token;
  }
  async createRefreshJWT(user) {
    const token = jwt.sign({ userId: user._id }, process.env.REFRESH_JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });
    return token;
  }
  
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, process.env.JWT_SECRET);
      return result.userId;
    } catch (error) {
      return null;
    }
  }
  async getUserIdByRefreshToken(token: string) {
    try {
     
      const result: any = jwt.verify(token, process.env.REFRESH_JWT_SECRET);
      
      return result.userId;
    } catch (error) {
      return null;
    }
  }

 
}



