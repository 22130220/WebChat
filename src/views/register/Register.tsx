import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  return (
    <>
      <h2>ℹ️ About Page</h2>
      <button onClick={() => navigate("/")}>Go Home (useNavigate)</button>
    </>
  );
}
