import UserLayout from "@/layout/UserLayout";
import React, { use, useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import styles from "./style.module.css";
import { registerUser, loginUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [userLoginMethod, setuserLoginMethod] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);
  //

  const handleRegister = () => {
    console.log("register");
    dispatch(registerUser({ username, name, email, password }));
  };

  const handleLogin = () => {
    console.log("Logging in user...");
    dispatch(loginUser({ email, password }));
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.topBody}>
              {userLoginMethod ? "Sign in" : "Sign Up"}
            </p>
            {authState.message}
            <p style={{ color: authState.isError ? "red" : "green" }}></p>

            <div className={styles.formContainer}>
              {!userLoginMethod && (
                <div className={styles.rowContainer}>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="username"
                  />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="name"
                  />
                </div>
              )}

              <div className={styles.emailContainer}>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.inputField}
                  type="email"
                  placeholder="email"
                />
              </div>
              <div className={styles.passwordContainer}>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.inputField}
                  type="password"
                  placeholder="password"
                />
              </div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (userLoginMethod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
                className={styles.buttonContainer}
              >
                <p>{userLoginMethod ? "sign in" : "signUp"}</p>
              </div>
            </div>
          </div>
          <div className={styles.cardContainer_right}>
            {userLoginMethod ? (
              <p>don't have acoount</p>
            ) : (
              <p>Already have an Account </p>
            )}
            <div
              onClick={() => {
                setuserLoginMethod(!userLoginMethod);
              }}
              className={styles.buttonOutline}
            >
              {" "}
              <p style={{ color: "white" }}>
                {userLoginMethod ? "sign up" : "sign in"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
export default LoginComponent;
