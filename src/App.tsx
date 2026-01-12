import { RouterProvider } from "react-router-dom";
import router from "./routers";
import { useTheme } from "./hooks/useTheme";
import ToastContainer from "./components/ToastContainer";

function App() {
  // Apply theme vào DOM
  useTheme();
  
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
