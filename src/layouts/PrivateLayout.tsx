import { Outlet } from "react-router-dom";
import { PrivateNavbar } from "../components/navbar/PrivateNavbar";

export function PrivateLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header>
        <PrivateNavbar />
      </header>

      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
}

export default PrivateLayout;
