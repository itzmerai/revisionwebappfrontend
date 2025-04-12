import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface BarData {
  program: string;
  student_count: number;
}

const ProgramBarChart: React.FC<{ data: BarData[] }> = ({ data }) => {
  return (
    <div className="bar-chart-container">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis 
            dataKey="program" 
            angle={-45} 
            textAnchor="end"
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Bar 
            dataKey="student_count" 
            fill="#20B2AA" 
            name="Students"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgramBarChart;