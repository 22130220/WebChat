import { useSelector } from "react-redux";
import OverlaySpinner from "../components/OverlaySpinner";
import type { RootState } from "../stores/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { PATH_CONSTRAINT } from "../routers";

function LoadingPage() {
  const settings = useSelector((state: RootState) => state.settings);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const redirectTo = params.get("redirectTo") || PATH_CONSTRAINT.LOGIN;

  useEffect(() => {
    if (settings.connected && redirectTo) {
      navigate(redirectTo);
    }
  }, [settings.connected]);

  return (
    <OverlaySpinner show={!settings.connected} text="Đang kết nối tới server" />
  );
}

export default LoadingPage;
