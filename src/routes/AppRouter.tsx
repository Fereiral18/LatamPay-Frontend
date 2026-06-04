import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { Home } from "../pages/Home/Home";
import { Login } from "../pages/Login/Login";
import { Register } from "../pages/Register/Register";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { NotFound } from "../pages/NotFound/NotFound";
import { PrivateLayout } from "../layouts/PrivateLayout";
import { PrivateRoute } from "./guards/PrivateRoute";
import { PublicRoute } from "./guards/PublicRoute";
import { paths } from "./paths";
import { Support } from "../pages/support/Support";
import { PublicLayout } from "../layouts/PublicLayaout";

export function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route element={<PublicRoute />}>
           <Route element={<PublicLayout />}>
          <Route path={paths.home} element={<Home />} />
            <Route path={paths.login} element={<Login />} />
            <Route path={paths.register} element={<Register />} />
            <Route path={paths.support} element={<Support />} />
          </Route>
           </Route>

          <Route element={<PrivateRoute />}>
            <Route element={<PrivateLayout />}>
              <Route path={paths.dashboard} element={<Dashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppRouter;
