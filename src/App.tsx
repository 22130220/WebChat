import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import Default from "./views/layouts/Default";
import React from "react";
import { PATH_CONSTRAINT } from "./routers";

function App() {
  const Login = React.lazy(() => import("./views/login/Login"));
  const Chat = React.lazy(() => import("./views/chat/Chat"));
  const Register = React.lazy(() => import("./views/register/Register"));

  const routes: RouteObject[] = [
    { path: PATH_CONSTRAINT.HOME, element: <Login /> },
    { path: PATH_CONSTRAINT.LOGIN, element: <Login />, loader: userLoader },
    { path: PATH_CONSTRAINT.CHAT, element: <Chat /> },
    { path: PATH_CONSTRAINT.REGISTER, element: <Register />, loader: userLoader },
  ];

  async function userLoader() {
    const userName = localStorage.getItem("USER_NAME");
    const reLoginCode = localStorage.getItem("RE_LOGIN_CODE");
    if (userName && reLoginCode) {
      return redirect("/chat");
    } else {
      return null;
    }
  }

  const router = createBrowserRouter([
    {
      element: <Default />,
      errorElement: <div>Đã có lỗi xảy ra</div>,
      children: routes,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
