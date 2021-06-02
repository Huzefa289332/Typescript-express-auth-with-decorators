import jwt from "jsonwebtoken";
type payloadType = string | Buffer | object;

export class JWTService {
  static generateToken = (payload: payloadType) => {
    return jwt.sign(payload, `${process.env.JWT_SECRET}`);
  };

  static verifyToken = (confirmationCode: string) => {
    return jwt.verify(confirmationCode, `${process.env.JWT_SECRET}`);
  };
}
