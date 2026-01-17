import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEvent } from "../../hooks/useEvent";
import wSocket from "../../utils/wSocket";
import backgroundleft from "../../assets/backgroundLeft.png";
import image from "../../assets/image.png";
import NotificationModal from "../../common/NotificationModal";
import CheckConnection from "../../common/CheckConnection";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../stores/themeSlice";
import type { RootState } from "../../stores/store";
import type { ILoginPayload } from "../../types/interfaces/IWebSocketEvent";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.theme);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return "☀️";
      case "dark":
        return "🌙";
      case "auto":
        return "🔄";
      default:
        return "☀️";
    }
  };

  const handleSignIn = () => {
    if (!userName || !password) {
      alert("Please enter both username and password.");
      return;
    }

    const loginPayload: ILoginPayload = {
      action: "onchat",
      data: {
        event: "LOGIN",
        data: {
          user: userName.trim(),
          pass: password.trim(),
        },
      },
    };
    wSocket.send(JSON.stringify(loginPayload));
  };

  useEvent("login_success", loginsuccess);

  function loginsuccess(data: any) {
    const RE_LOGIN_CODE = data.data.RE_LOGIN_CODE;
    localStorage.setItem("USER_NAME", userName);
    localStorage.setItem("RE_LOGIN_CODE", RE_LOGIN_CODE);
    setNotificationMessage(
      `Chào mừng quay trở lại, ${userName}! Bạn đã đăng nhập thành công.`,
    );
    setShowNotification(true);
  }

  function handlePageChat() {
    navigate("/chat");
  }

  useEvent("relogin_success", reLoginSuccess);

  function reLoginSuccess(data: any) {
    const RE_LOGIN_CODE = data.data.RE_LOGIN_CODE;
    localStorage.setItem("RE_LOGIN_CODE", RE_LOGIN_CODE);
  }

  return (
    <>
      <div className="flex m-auto shadow-lg items-stretch h-screen rounded-lg overflow-hidden bg-[var(--bg-primary)] relative">
        {/* Theme Toggle Button - Góc phải trên */}
        <button
          onClick={handleToggleTheme}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] flex items-center justify-center transition-colors shadow-md"
          title={`Theme: ${theme}`}
        >
          <span className="text-xl">{getThemeIcon()}</span>
        </button>

        <div className="w-[70%] p-5 flex h-full ">
          <img
            src={backgroundleft}
            className=" w-full h-full object-cover rounded-lg"
            alt="Image"
          />
        </div>
        <div className="w-[30%] p-5 flex flex-col rounded-lg border-[var(--border-primary)] border-2 shadow-2xl m-2 h-full bg-[var(--bg-primary)]">
          <div className="flex gap-3 items-center mb-4">
            <img src={image} className="w-12 h-12" alt="LogoNLU" />
            <div className="flex items-center text-2xl text-[var(--text-primary)]">
              NLU
            </div>
          </div>
          <div className="flex flex-col flex-1 h-full gap-4">
            <div className="font-medium text-[var(--text-primary)]">
              Rất vui được gặp lại bạn
            </div>
            <div className="flex font-medium text- flex-col">
              <div className="flex flex-col mt-4">
                <label
                  htmlFor="username"
                  className="font-bold text-sm text-left text-[var(--text-primary)]"
                >
                  Tên đăng nhập:
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full rounded-md pr-10 bg-[var(--bg-tertiary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] border border-[var(--border-primary)]"
                  placeholder="Tên tài khoản"
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                />
              </div>
              <div className="flex flex-col mt-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-[var(--text-primary)] text-left "
                >
                  Mật khẩu:
                </label>
                <div className="flex flex-col items-center">
                  <input
                    type="password"
                    id="password"
                    placeholder="Nhập mật khẩu"
                    required
                    name="password"
                    className="mt-1 p-2 w-full rounded-md pr-10 bg-[var(--bg-tertiary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] border border-[var(--border-primary)]"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    id="togglePassword"
                    className="focus:outline-none -ml-8"
                  ></button>
                </div>
              </div>
            </div>

            <button
              className="bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] p-2 mt-3 rounded-md text-white font-medium transition-colors"
              onClick={handleSignIn}
            >
              Đăng Nhập
            </button>
            <div className="flex justify-center gap-3">
              <div className="text-sm text-[var(--text-secondary)]">
                Bạn chưa có tài khoản?
              </div>
              <Link
                to="/register"
                className="text-[var(--accent-primary)] hover:text-[var(--accent-hover)] text-sm transition-colors"
              >
                Đăng Ký
              </Link>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="font-bold text-sm text-[var(--text-primary)]">
              Nhóm
            </div>
            <div className="font-bold text-sm text-[var(--text-primary)]">
              WebChat
            </div>
          </div>
        </div>
      </div>
      {showNotification && (
        <NotificationModal
          message={notificationMessage}
          returnPage={handlePageChat}
        />
      )}
      <CheckConnection />
    </>
  );
}
