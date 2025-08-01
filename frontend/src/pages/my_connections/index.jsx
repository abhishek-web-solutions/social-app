import {
  AcceptConnection,
  getMyConnectionRequests,
} from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashBoardLayout";
import UserLayout from "@/layout/UserLayout";
import { connect, useDispatch, useSelector } from "react-redux";
import React, { act, use, useEffect } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";

export default function Myconnections() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  useEffect(() => {
    console.log("my connections page");
    dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
  }, []);
  useEffect(() => {
    if (authState.connectionRequests.length !== 0) {
      console.log(authState.connectionRequests);
    }
  }, [authState.connectionRequests]);
  return (
    <UserLayout>
      <DashboardLayout>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}
        >
          <h4> Requests</h4>
          {authState.connectionRequests.length === 0 && (
            <h3> No connection Request</h3>
          )}
          {authState.connectionRequests.length !== 0 &&
            authState.connectionRequests
              .filter((connection) => connection.status_accepted === null)
              .map((user, index) => {
                return (
                  <div
                    onClick={() => {
                      router.push(`/view_profile/${user.userId.user}`);
                    }}
                    className={styles.userCard}
                    key={index}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div className={styles.profilePicture}>
                        <img
                          src={`https://social-app-j6oo.onrender.com/uploads/${user.userId.profilePicture}`}
                          alt=""
                        />
                      </div>
                      <div className={styles.userInfo}>
                        <h3>{user.userId.name}</h3>
                        <p>{user.userId.username}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            AcceptConnection({
                              connectionId: user._id,
                              token: localStorage.getItem("token"),
                              action: "accept",
                            })
                          );
                        }}
                        className={styles.connectedButton}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                );
              })}
          <h4>Friends</h4>
          {authState.connectionRequests
            .filter((connection) => connection.status_accepted !== null)
            .map((user, index) => {
              return (
                <div
                  onClick={() => {
                    router.push(`/view_profile/${user.userId.user}`);
                  }}
                  className={styles.userCard}
                  key={index}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className={styles.profilePicture}>
                      <img
                        src={`https://social-app-j6oo.onrender.com/uploads/${user.userId.profilePicture}`}
                        alt=""
                      />
                    </div>
                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <p>{user.userId.username}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
