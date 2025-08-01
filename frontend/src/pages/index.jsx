import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import LoginComponent from "./login";
import UserLayout from "@/layout/UserLayout";

export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>
            <p>Connect with Friends without Exaggertion</p>
            <p>
              A true social media <br /> platfrom, with stories no blufs
            </p>
            <div
              onClick={() => {
                router.push("login");
              }}
              className={styles.buttonJoin}
            >
              <p>join now</p>
            </div>
          </div>
          <div className={styles.mainContainer_right}>
            <img src="images/socialmedia.jpg" alt="" />
            <p
              style={{
                fontFamily: "cursive",
                fontSize: "0.5rem",
                textAlign: "center",
              }}
            >
              @copyright2025 abhishek dwivedi
            </p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
