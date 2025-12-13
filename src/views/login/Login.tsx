import { Link } from "react-router-dom";
import { PATH_CONSTRAINT } from "../../routers";

export default function Login() {
  return (
    <>
      <Link to={PATH_CONSTRAINT.CHAT}>Nhấn nè</Link>
      <h2>🏠 Home Page</h2>
    </>
  );
}
