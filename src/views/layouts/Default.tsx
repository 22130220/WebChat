import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import OverlaySpinner from "../../components/OverlaySpinner";
import { useSelector } from "react-redux";
import type { RootState } from "../../stores/store";

export default function Layout() {
  const connected = useSelector((state: RootState) => state.settings.connected);
  const isRelogin = useSelector((state: RootState) => state.settings.isRelogin);
  
  // Kiểm tra xem có đang trong quá trình relogin không
  const hasReloginCode = !!localStorage.getItem("RE_LOGIN_CODE");
  const isReloginInProgress = connected && hasReloginCode && !isRelogin;
  
  // Hiển thị overlay khi: đang kết nối HOẶC đang relogin
  const showOverlay = !connected || isReloginInProgress;
  const overlayText = !connected 
    ? "Đang kết nối..." 
    : isReloginInProgress 
    ? "Đang đăng nhập lại..." 
    : "";
  
  return (
    <>
      <main>
        <Suspense>
          <Outlet />
        </Suspense>
        <OverlaySpinner show={showOverlay} text={overlayText} />
      </main>
    </>
  );
}
