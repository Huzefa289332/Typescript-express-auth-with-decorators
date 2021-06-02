import { Request, Response } from "express";
import { controller, get, post, use, validate } from "../decorators";
import { User } from "../repositories/user";
import {
  signInCredentials,
  signUpCredentials,
  currentUser,
  validateRequest,
  requireAuth,
} from "../middlewares";

@controller("/api/users")
export class UserController {
  @post("/signup")
  @validate(signUpCredentials)
  @use(validateRequest)
  async signUp(req: Request, res: Response) {
    const { username, email, password } = req.body;
    const { user, userJWT } = await User.signUp(username, email, password);
    req.session = { jwt: userJWT };
    res.status(201).send(user);
  }

  @post("/signin")
  @validate(signInCredentials)
  @use(validateRequest)
  async signIn(req: Request, res: Response) {
    const { email, password } = req.body;
    const { existingUser, userJWT } = await User.signIn(email, password);
    req.session = { jwt: userJWT };
    res.status(200).send(existingUser);
  }

  @post("/signout")
  signOut(req: Request, res: Response) {
    req.session = null;
    res.send({});
  }

  @get("/currentuser")
  @use(currentUser)
  @use(requireAuth)
  currentUser(req: Request, res: Response) {
    res.send({ currentUser: req.currentUser || null });
  }

  @get("/confirm/:confirmationCode")
  async confirm(req: Request, res: Response) {
    const { confirmationCode } = req.params;
    const isConfirm = await User.confirm(confirmationCode);
    if (isConfirm) res.status(200).send({ message: "Email verified!" });
  }
}
