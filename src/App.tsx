import { useDispatch, useSelector } from "react-redux";
import { decrement, increment } from "./stores/counterSlice";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./views/login/Login";
import Register from "./views/register/Register";

function App() {
  const count = useSelector((state) => state.counter.value);

  const dispatch = useDispatch();
  return (
    <>
      <h1>Count: {count}</h1>
      <button
        className="p-2 bg-amber-600"
        onClick={() => dispatch(increment())}
      >
        +
      </button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <div>Test</div>
      <div>Hello</div>

      <nav style={{ display: "flex", gap: 16 }}>
        <Link to="/">Login</Link>
        <Link to="/register">Register</Link>
      </nav>

      <hr />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
