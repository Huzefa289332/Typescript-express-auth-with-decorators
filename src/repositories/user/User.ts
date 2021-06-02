import { User as UserModel } from "../../models/User";
import { BadRequestError } from "../../errors";
import { EmailService, JWTService } from "../../services";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class User {
  static signUp = async (username: string, email: string, password: string) => {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email in use");
    }
    const confirmationCode = JWTService.generateToken({ email });
    const user = UserModel.build({
      username,
      email,
      password,
      confirmationCode,
    });
    await user.save();
    const userJWT = JWTService.generateToken({
      id: user.id,
      email: user.email,
    });
    EmailService.sendConfirmationEmail(
      user.username,
      user.email,
      confirmationCode
    );
    return { user, userJWT };
  };

  static signIn = async (email: string, password: string) => {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid Credentials");
    }
    const passwordsMatch = await User.comparePassword(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Credentials");
    }
    if (existingUser.status === "Pending") {
      throw new BadRequestError("Pending account. Please verify your email.");
    }
    const userJWT = JWTService.generateToken({
      id: existingUser.id,
      email: existingUser.email,
    });
    return { existingUser, userJWT };
  };

  static confirm = async (confirmationCode: string) => {
    try {
      const { email } = JWTService.verifyToken(confirmationCode) as {
        email: string;
        iat: number;
      };
      const existingUser = await UserModel.findOne({ email });
      if (!existingUser) {
        throw new BadRequestError("User not found.");
      }
      existingUser.status = "Active";
      await existingUser.save();
      return true;
    } catch (err) {
      throw new BadRequestError("Invalid token");
    }
  };

  static hashPassword = async (password: string) => {
    const salt = randomBytes(8).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  };

  static comparePassword = async (
    storedPassword: string,
    suppliedPassword: string
  ) => {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    return buf.toString("hex") === hashedPassword;
  };
}
