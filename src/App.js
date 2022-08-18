import { PhoneNumber } from "./components/PhoneNumber";
import { useWebSocket } from "./hooks/useWebSocket";

function App() {
  const { data } = useWebSocket();

  return (
    <>
      <PhoneNumber />
      {data.map((el) => {
        return (
          <>
            <p className="flex justify-center" key={el.id}>
              {el.phone}
            </p>
          </>
        );
      })}
    </>
  );
}

export default App;
