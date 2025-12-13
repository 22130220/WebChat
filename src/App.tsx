import { useDispatch, useSelector } from "react-redux";
import { decrement, increment } from "./stores/counterSlice";

function App() {
  const count = useSelector((state) => state.counter.value);

  const dispatch = useDispatch();
  return (
    <div>
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
    </div>
  );
}

export default App;
