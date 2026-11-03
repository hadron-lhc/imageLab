import { ANALYSIS_VERSION } from './engine';

export default function App() {
  return (
    <main className="app">
      <h1>ImageLab</h1>
      <p>Local-first image analysis and organization.</p>
      <p className="meta">Engine analysis version: {ANALYSIS_VERSION}</p>
    </main>
  );
}
