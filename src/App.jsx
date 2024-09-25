import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./Router";
function App() {
  return (
    <BrowserRouter>
      <div>
         <AppRouter />
      </div>
      
    </BrowserRouter>
  );
}

export default App;
