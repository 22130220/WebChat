import { Link } from "react-router-dom";
import { PATH_CONSTRAINT } from "../../routers";

export default function Register() {
  

  return (
    <>
      <h2>ℹ️ About Page</h2>
       <Link to={PATH_CONSTRAINT.HOME}>Go Home</Link>
    </>
  );
}
