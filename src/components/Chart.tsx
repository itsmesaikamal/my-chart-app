import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import html2canvas from 'html2canvas';
import './Chart.css';

interface DataPoint {
  timestamp: string;
  value: number;
}

interface ChartProps {
  timeframe: string;
}

const Chart: React.FC<ChartProps> = ({ timeframe }) => {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('/assets/data.json');
        setData(result.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter(point => {
    const date = new Date(point.timestamp);
    if (timeframe === 'daily') {
      return true;
    } else if (timeframe === 'weekly') {
      return date.getDay() === 0;
    } else if (timeframe === 'monthly') {
      return date.getDate() === 1;
    }
    return true;
  });

  const exportChart = async (format: 'png' | 'jpg') => {
    const chartElement = document.getElementById('chart-container');
    if (chartElement) {
      const canvas = await html2canvas(chartElement, { logging: true, useCORS: true });
      const dataUrl = canvas.toDataURL(`image/${format}`);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `chart.${format}`;
      link.click();
    }
  };

  return (
    <div className="chart-container" id="chart-container">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
      <div className="export-buttons">
        <button onClick={() => exportChart('png')}>Export as PNG</button>
        <button onClick={() => exportChart('jpg')}>Export as JPG</button>
      </div>
    </div>
  );
};

export default Chart;
