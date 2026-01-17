import { store } from "../stores/store";
import { setUserOnlineStatus } from "../stores/onlineStatusSlice";
import { PATH_CONSTRAINT } from "../routers";
import { showError } from "../stores/notificationSlice";

export const GLOBAL_EVENT = {
  relogin_success: (data: any) => {
    const RE_LOGIN_CODE = data.data.RE_LOGIN_CODE;
    console.log(RE_LOGIN_CODE);
    localStorage.setItem("RE_LOGIN_CODE", RE_LOGIN_CODE);
  },
  check_user_online_success: (data: any) => {
    const isOnline = data.data.status;
    console.log(isOnline);
    store.dispatch(
      setUserOnlineStatus({
        isOnline: data.data.status,
      })
    );
  },
  auth_error: () => {
    localStorage.removeItem("RE_LOGIN_CODE");
    localStorage.removeItem("USER_NAME");
    window.location.href = PATH_CONSTRAINT.LOGIN;
  },
  register_error: () => {
    localStorage.removeItem("RE_LOGIN_CODE");
    localStorage.removeItem("USER_NAME");
    store.dispatch(showError(`Tài khoản đã tồn tại`))
  },

}
