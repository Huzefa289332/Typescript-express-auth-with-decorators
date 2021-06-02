import { transport } from "../config/mailer";

export class EmailService {
  static sendConfirmationEmail = (
    username: string,
    email: string,
    confirmationCode: string
  ): void => {
    transport.sendMail({
      from: `${process.env.EMAIL}`,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${username}</h2>
        <p>Thank you for registering :) Please confirm your email by clicking on the following link</p>
        <a href=${process.env.SERVER}/api/users/confirm/${confirmationCode}> Click here</a>
        </div>`,
    });
  };
}
