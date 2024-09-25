import { Route, Routes } from "react-router-dom";
import { PAGE_URLS } from "./paths";
import { Home } from "../Pages/Home";

export default function AppRouter() {
  return (
    <Routes>
      <Route path={PAGE_URLS.HOME} element={<Home />} exact />
  </Routes>
  );
}
