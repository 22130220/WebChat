import { Link } from "react-router-dom";
import { PATH_CONSTRAINT } from "../../routers";

export default function Chat() {
  return (
  <>Here is chat interface
  <br/>
  <Link to={PATH_CONSTRAINT.HOME}>Go Home</Link>
  </>
)
   
}
