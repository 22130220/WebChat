import { RouterProvider } from "react-router-dom";
import router from "./routers";
import { useTheme } from "./hooks/useTheme";

function App() {
  // Apply theme vào DOM
  useTheme();
  
  return <RouterProvider router={router} />;
}

export default App;
