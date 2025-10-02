import Dashboard from "./components/composite/dashboard";
import { SimulationProvider } from "./components/providers/simulation-provider";
import { SocketProvider } from "./components/providers/socket-provider";
import { ThemeProvider } from "./components/providers/theme-provider";

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <SimulationProvider>
          <Dashboard />
        </SimulationProvider>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
