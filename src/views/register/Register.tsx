import { Link, useNavigate } from "react-router-dom";
import backgroundleft from "../../assets/backgroundLeft.png";
import image from "../../assets/image.png";
import { useState } from "react";
import { useEvent } from "../../hooks/useEvent";
import wSocket from "../../utils/wSocket";
import NotificationModal from "../../common/NotificationModal";
import type { IRegisterPayload } from "../../types/interfaces/IWebSocketEvent";
import { PATH_CONSTRAINT } from "../../routers";

export default function Register() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("Bạn đã đăng ký thành công.");
  const navigate = useNavigate();

  const payLoadRegister: IRegisterPayload = {
    action: "onchat",
    data: {
      event: "REGISTER",
      data: {
        user: userName.trim(),
        pass: password.trim(),
      },
    },
  };

  function handleRegister() {
    if (!userName || !password) {
      alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }
    wSocket.send(JSON.stringify(payLoadRegister));
  }

  useEvent("register_success", registerSuccess);

  function returnLogin() {
    navigate(PATH_CONSTRAINT.LOGIN);
  }

  function registerSuccess() {
    setShow(true);
    setMessage(`Người dùng ${userName} đã được đăng ký thành công.`);
  }

  return (
    <>
      <div className="flex m-auto shadow-lg items-stretch h-screen">
        <div className="w-[70%] p-5 flex">
          <img
            src={backgroundleft}
            className="w-full h-full object-cover rounded-lg"
            alt="Image"
          />
        </div>
        <div className="w-[30%] p-5 flex flex-col rounded-lg border-white border-2 shadow-2xl m-0 h-full">
          <div className="flex gap-3 items-center mb-4">
            <img src={image} className="w-12 h-12" alt="LogoNLU" />
            <div className="flex items-center text-2xl">NLU</div>
          </div>

          <div className="flex flex-col flex-1 gap-4">
            <div className="font-medium">Tạo tài khoản mới</div>

            <div className="flex flex-col ">
              <label htmlFor="username" className="font-bold text-sm text-left">
                Tên đăng nhập:
              </label>
              <input
                type="text"
                className="mt-1 p-2 w-full bg-[#F2F2F2] rounded-md pr-10"
                placeholder="Tên tài khoản"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="font-bold text-sm text-left">
                Mật khẩu:
              </label>
              <input
                type="password"
                id="password"
                placeholder="Nhập mật khẩu"
                required
                name="password"
                className="mt-1 p-2 w-full bg-[#F2F2F2] rounded-md pr-10"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="bg-[#007AFF] p-2 mt-3 text-white font-medium rounded-lg"
              onClick={handleRegister}
            >
              Đăng Ký
            </button>

            <div className="flex justify-center gap-3">
              <div className="text-sm">Bạn đã có tài khoản?</div>
              <Link to="/login" className="text-blue-600 text-sm">
                Đăng Nhập
              </Link>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="font-bold text-sm">Nhóm</div>
            <div className="font-bold text-sm">WebChat</div>
          </div>
        </div>
      </div>

      {show && <NotificationModal message={message} returnPage={returnLogin} />}
    </>
  );
}
