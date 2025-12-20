import { Outlet } from "react-router-dom";
import { Suspense } from "react";

export default function Layout() {
  return (
    <>
      <main>
        <Suspense>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
}
