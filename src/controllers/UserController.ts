import { Request, Response } from "express";
import { controller, get, post, use, validateBody } from "../decorators";
import { User } from "../repositories/user";
import { currentUser, requireAuth } from "../middlewares";
import { signInCredentials, signUpCredentials } from "../validations/user";

@controller("/api/users")
export class UserController {
  @post("/signup")
  @validateBody(signUpCredentials)
  async signUp(req: Request, res: Response) {
    const { username, email, password } = req.body;
    const { user, userJWT } = await User.signUp(username, email, password);
    req.session = { jwt: userJWT };
    res.status(201).send(user);
  }

  @post("/signin")
  @validateBody(signInCredentials)
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
