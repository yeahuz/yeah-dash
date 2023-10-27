import { useContext } from "preact/hooks";
import { AuthContext } from "./auth/state.jsx";
import { Login } from "./auth/login.jsx";
import { Webauthn } from "./auth/webauthn.jsx";
import { Layout } from "./core/layout.jsx";
import { NotFound } from "./core/404.jsx";
import { Listings } from "./listing/list.jsx";
import { Categories } from "./categories/list.jsx";
import { Attributes } from "./attributes/list.jsx";
import { ShippingServices } from "./shipping/services/list.jsx";
import { Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";

function ProtectedRoute({ allowed, children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const isAllowed = user?.roles?.find((role) => allowed.includes(role.code));

  if (!isAllowed) {
    if (user) {
      return <Navigate to="/404" replace />
    } else return <Navigate to="/auth/login" state={{ from: location }} />
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} />
  }

  return children ? children : <Outlet />
}

export function RenderedRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowed={["ADMIN"]} />}>
        <Route path="/" element={<Layout />}>
          <Route path="/listings" element={<Listings />}></Route>
          <Route path="/categories" element={<Categories />}></Route>
          <Route path="/attributes" element={<Attributes />}></Route>
          <Route path="/shipping-services" element={<ShippingServices />}></Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
      <Route path="/auth/login" element={<Login />}></Route>
      <Route path="/auth/webauthn" element={<Webauthn />}></Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
