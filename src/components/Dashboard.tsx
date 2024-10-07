import React from 'react';
import { DollarSign, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Dummy data for demonstration
  const monthlySpend = 1250;
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Calendar className="text-blue-500 mr-2" size={24} />
            <span className="text-xl font-semibold">{currentMonth} Overview</span>
          </div>
        </div>
        <div className="flex items-center justify-center p-4 bg-blue-100 rounded-lg">
          <DollarSign className="text-green-500 mr-2" size={32} />
          <span className="text-3xl font-bold">${monthlySpend}</span>
        </div>
        <p className="mt-4 text-gray-600 text-center">
          Total amount spent this month
        </p>
      </div>
      {/* You can add more dashboard widgets here */}
    </div>
  );
};

export default Dashboard;