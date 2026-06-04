import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/navbar/PublicNavbar";

export const PublicLayout = () => {
  return (
    <>
      <PublicNavbar />
      <main className="pt-20">
        <Outlet />
      </main>
    </>
  );
};