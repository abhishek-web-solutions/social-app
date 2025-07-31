import { getAllUsers } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashBoardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import styles from "./index.module.css";
import { Router, useRouter } from "next/router";

export default function DiscoverPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  useEffect(() => {
    console.log("all users");
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, []);
  return (
    <UserLayout>
      <DashboardLayout>
        <h2 className={styles.discover}>Discover</h2>
        <div className={styles.allUserProfile}>
          {authState.all_profiles_fetched &&
            authState.all_users.map((user) => {
              return (
                <div
                  onClick={() => {
                    router.push(`view_profile/${user.userId.username}`);
                  }}
                  key={user.id}
                  className={styles.userProfile}
                >
                  <img
                    src={`https://social-app-j6oo.onrender.com/uploads/${user.userId.profilePicture}`}
                    alt={`${user.name}'s profile`}
                  />
                  <div>
                    <h2>{user.userId.name}</h2>
                    <p>{user.userId.username}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
