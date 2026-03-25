import { SignIn } from "@clerk/clerk-react";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-wrapper">
      <SignIn
        appearance={{
          elements: {
            card: "clerk-card",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            formButtonPrimary: "primary-btn",
            formFieldInput: "clerk-input",
          },
        }}
      />
    </div>
  );
}