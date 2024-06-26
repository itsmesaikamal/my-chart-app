import React, { useState } from 'react';
import Chart from './components/Chart';
import TimeframeButtons from './components/TimeframeButtons';
import './App.css';

const App: React.FC = () => {
  const [timeframe, setTimeframe] = useState<string>('daily');

  return (
    <div className="App">
      <h1>Interactive Chart</h1>
      <TimeframeButtons setTimeframe={setTimeframe} />
      <Chart timeframe={timeframe} />
    </div>
  );
};

export default App;
