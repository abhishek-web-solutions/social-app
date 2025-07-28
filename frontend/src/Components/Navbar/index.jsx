import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

export default function NavBarComponents() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  return (
    <div classname={styles.container}>
      <nav className={styles.navbar}>
        <h1
          onClick={() => {
            router.push("/");
          }}
        >
          Pro Connect
        </h1>
        <div className={styles.navBarOptionContainer}>
          {authState.profileFetched && (
            <div className={styles.profile}>
              <h3>Hey,{authState.user.userId.name}</h3>
              <h3
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                }}
              >
                logout
              </h3>
            </div>
          )}
          {!authState.profileFetched && (
            <div>
              <p
                onClick={() => {
                  router.push("/login");
                }}
              >
                {" "}
                be a part
              </p>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
