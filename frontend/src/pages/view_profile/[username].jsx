import { clientServer } from "@/config";
import DashboardLayout from "@/layout/DashBoardLayout";
import UserLayout from "@/layout/UserLayout";
import styles from "./index.module.css";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function ViewProfilePage({ userProfile }) {
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
              src={`http://localhost:5000/uploads/${userProfile.userId.profilePicture}`}
              alt=""
            />
          </div>
          <div className={styles.profileContainer_details}>
            <div style={{ display: "flex", gap: "0.7rem" }}>
              <div style={{ flex: "0.8" }}></div>
              <div style={{ flex: "0.2" }}></div>
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
