import NavBarComponents from "@/Components/Navbar";
import React from "react";
function UserLayout({ children }) {
  return (
    <div>
      <NavBarComponents />

      {children}
    </div>
  );
}
export default UserLayout;
