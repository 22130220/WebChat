import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEvent } from "../../hooks/useEvent";
import wSocket from "../../utils/wSocket";
import backgroundleft from "../../assets/backgroundLeft.png";
import image from "../../assets/image.png";
import NotificationModal from "../../common/NotificationModal";
import CheckConnection from "../../common/CheckConnection";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const navigate = useNavigate();

  const handleSignIn = () => {
    if (!userName || !password) {
      alert("Please enter both username and password.");
      return;
    }

    const loginPayload = {
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
      `Welcome back, ${userName}! You have logged in successfully.`,
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
      <div className="flex m-auto shadow-lg items-stretch h-screen rounded-lg overflow-hidden">
        <div className="w-[70%] p-5 flex h-full ">
          <img
            src={backgroundleft}
            className=" w-full h-full object-cover rounded-lg"
            alt="Image"
          />
        </div>
        <div className="w-[30%] p-5 flex flex-col rounded-lg border-white border-2 shadow-2xl m-2 h-full">
          <div className="flex gap-3 items-center mb-4">
            <img src={image} className="w-12 h-12" alt="LogoNLU" />
            <div className="flex items-center text-2xl">NLU</div>
          </div>
          <div className="flex flex-col flex-1 h-full gap-4">
            <div className="font-medium">Nice to see you again</div>
            <div className="flex font-medium text- flex-col">
              <div className="flex flex-col mt-4">
                <label
                  htmlFor="username"
                  className="font-bold text-sm text-left"
                >
                  Username:
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full  rounded-md pr-10 bg-[#F2F2F2]"
                  placeholder="Username"
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                />
              </div>
              <div className="flex flex-col mt-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-black-800 text-left "
                >
                  Password:
                </label>
                <div className="flex flex-col items-center">
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your Password"
                    required
                    name="password"
                    className="mt-1 p-2 w-full  rounded-md pr-10 bg-[#F2F2F2] "
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

            <div className="flex justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  placeholder="Your password"
                  className="w-4 h-4 text-blue-600 border-gray-200 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="remember-me"
                  className="block ml-2 text-sm text-neutral-600"
                >
                  {" "}
                  Remember me{" "}
                </label>
              </div>
            </div>

            <button
              className="bg-[#007AFF] p-2 mt-3 rounded-md text-white font-medium"
              onClick={handleSignIn}
            >
              Sign In
            </button>
            <div className="flex justify-center gap-3">
              <div className="text-sm">Don't have an account?</div>
              <Link to="/register" className="text-blue-600 text-sm">
                Sign up now
              </Link>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="font-bold text-sm">Nhóm</div>
            <div className="font-bold text-sm">WebChat</div>
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
