import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";
import Default from "./views/layouts/Default";
import React from "react";
import { PATH_CONSTRAINT } from "./routers";
import { store } from "./stores/store";

function App() {
  const Login = React.lazy(() => import("./views/login/Login"));
  const Chat = React.lazy(() => import("./views/chat/Chat"));
  const Register = React.lazy(() => import("./views/register/Register"));
  const EmptyChat = React.lazy(() => import("./views/chat/partials/EmptyChat"));
  const ChatMain = React.lazy(() => import("./views/chat/partials/ChatMain"));
  const LoadingPage = React.lazy(() => import("./views/LoadingPage"));

  const routes: RouteObject[] = [
    { path: PATH_CONSTRAINT.HOME, element: <LoadingPage /> },
    { path: PATH_CONSTRAINT.LOGIN, element: <Login />, loader: userLoader },
    {
      path: PATH_CONSTRAINT.CHAT,
      element: <Chat />,
      children: [
        { index: true, element: <EmptyChat /> },
        { path: ":name/type/:type", element: <ChatMain /> },
      ],
      loader: checkConnectionLoader,
    },
    {
      path: PATH_CONSTRAINT.REGISTER,
      element: <Register />,
      loader: userLoader,
    },
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

  async function checkConnectionLoader({ request }) {
    const settings = store.getState().settings;
    if (settings && !settings.connected) {
      const url = new URL(request.url);
      const currentPath = url.pathname + url.search;
      const encodeURI = `/?redirectTo=${encodeURIComponent(currentPath)}`;

      return redirect(encodeURI);
    }
    return null;
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
