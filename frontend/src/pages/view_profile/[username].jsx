import { clientServer } from "@/config";
import DashboardLayout from "@/layout/DashBoardLayout";
import UserLayout from "@/layout/UserLayout";
import styles from "./index.module.css";
import { useSearchParams } from "next/navigation";
import {
  getConnectionsRequest,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import React, { use, useEffect } from "react";
import { useRouter } from "next/router";
import { getAllPosts } from "@/config/redux/action/postAction";

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const postReducer = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);
  const getUsersPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(
      getConnectionsRequest({
        token: localStorage.getItem("token"),
      })
    );
  };
  useEffect(() => {
    let post = postReducer.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });
    setUserPosts(post);
  }, [postReducer.posts]);
  useEffect(() => {
    if (
      authState.connections.some(
        (user) => user.connectionId._id === userProfile.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);
      if (
        authState.connections.find(
          (user) => user.connectionId._id === userProfile.userId._id
        ).status_accepted ===
        true
      ) {
        setIsConnectionNull(false);
      }
    }
  }, [authState.connections]);
  useEffect(() => {
    getUsersPost();
  }, []);
  const searchParams = useSearchParams();
  useEffect(() => {
    console.log("View Profile Page Loaded");
  });

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              src={`https://social-app-j6oo.onrender.com/uploads/${userProfile.userId.profilePicture}`}
              alt=""
            />
          </div>
          <div className={styles.profileContainer_details}>
            <div style={{ display: "flex", gap: "0.7rem" }}>
              <div style={{ flex: "0.8" }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit_content",
                    alignItems: "center",
                  }}
                >
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "grey" }}>
                    @{userProfile.userId.username}
                  </p>
                </div>
                {isCurrentUserInConnection ? (
                  <button className={styles.connectedButton}>
                    {isConnectionNull ? "pending" : "connected"}
                  </button>
                ) : (
                  <button
                    className={styles.connectionBtn}
                    onClick={() => {
                      dispatch(
                        sendConnectionRequest({
                          token: localStorage.getItem("token"),
                          userId: userProfile.userId._id,
                        })
                      );
                    }}
                  >
                    connect
                  </button>
                )}
                <div>
                  <p>{userProfile.bio}</p>
                </div>
              </div>
              <div style={{ flex: "0.2" }}>
                <h3>recent </h3>
                {userPosts.map((post) => {
                  return (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card_profileContainer}>
                          {post.media !== "" ? (
                            <img
                              src={`https://social-app-j6oo.onrender.com/uploads/${post.media}`}
                              alt=""
                            />
                          ) : (
                            <div style={{ width: "3.4rem", height: "3.4rem" }}>
                              {post.body}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  console.log("getServerSideProps called for ViewProfilePage");
  console.log(context.query.username);
  const request = await clientServer.get(
    "/user/get_profile_based_on_username",
    {
      params: {
        username: context.query.username,
      },
    }
  );
  const response = await request.data;
  console.log("Response from server:", response);
  return { props: { userProfile: request.data.profile } };
}
