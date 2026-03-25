import { SignUp } from "@clerk/clerk-react";
import "./Register.css";

export default function Register() {
  return (
    <div className="register-wrapper">
      <SignUp />
    </div>
  );
}