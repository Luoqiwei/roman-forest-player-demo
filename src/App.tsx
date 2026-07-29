import { DemoProvider } from './context/DemoContext';
import { PlayerPage } from './components/PlayerPage';

export default function App() {
  return (
    <DemoProvider>
      <PlayerPage />
    </DemoProvider>
  );
}
