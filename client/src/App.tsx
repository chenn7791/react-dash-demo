import { decrement, increment, incrementByAmount } from './features/counter/counterSlice';
import { useAppDispatch, useAppSelector } from './hooks';

function App() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <main className="app">
      <section className="panel">
        <p className="eyebrow">React 18 + TypeScript + Redux Toolkit</p>
        <h1>Client Counter</h1>
        <output className="counter" aria-label="count">
          {count}
        </output>
        <div className="actions">
          <button type="button" onClick={() => dispatch(decrement())}>
            -1
          </button>
          <button type="button" onClick={() => dispatch(increment())}>
            +1
          </button>
          <button type="button" onClick={() => dispatch(incrementByAmount(5))}>
            +5
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
