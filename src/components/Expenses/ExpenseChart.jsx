import { useEffect, useState, useCallback } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaChartPie } from 'react-icons/fa';
import { useExpenses } from '../../context/ExpenseProvider';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = () => {
  const { entries } = useExpenses();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Expense Distribution',
        data: [],
        backgroundColor: [],
        borderWidth: 2,
      },
    ],
  });
  const [filter, setFilter] = useState('All');

  const fetchChartData = useCallback(() => {
    const tags = [
      { name: 'Shopping', color: '#F59E0B' },
      { name: 'Entertainment', color: '#8B5CF6' },
      { name: 'Food', color: '#10B981' },
      { name: 'Travel', color: '#3B82F6' },
      { name: 'Health', color: '#EF4444' },
    ];

    const filteredEntries =
      filter === 'All'
        ? entries
        : entries.filter((entry) => entry.type === filter);

    const revenueTotal = filteredEntries
      .filter((entry) => entry.type === 'Revenue')
      .reduce((acc, entry) => acc + parseFloat(entry.amount || 0), 0);

    const expensesByTags = filteredEntries
      .filter((entry) => entry.type === 'Expenses')
      .reduce((acc, entry) => {
        const tag = entry.tag || 'Expenses';
        acc[tag] = (acc[tag] || 0) + parseFloat(entry.amount || 0);
        return acc;
      }, {});

    const subscriptionTotal = filteredEntries
      .filter((entry) => entry.type === 'Subscription')
      .reduce((acc, entry) => acc + parseFloat(entry.amount || 0), 0);

    const labels = ['Revenue', ...Object.keys(expensesByTags), 'Subscriptions'];
    const data = [
      revenueTotal,
      ...Object.values(expensesByTags),
      subscriptionTotal,
    ];
    const backgroundColors = [
      '#4CAF50',
      ...Object.keys(expensesByTags).map(
        (tag) => tags.find((t) => t.name === tag)?.color || '#FF5252'
      ),
      '#FFEB3B',
    ];

    setChartData({
      labels,
      datasets: [
        {
          label: 'Expense Distribution',
          data,
          backgroundColor: backgroundColors,
        },
      ],
    });
  }, [entries, filter]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  return (
    <div className='p-6 border-[1px] border-purplea rounded-lg shadow-md w-full max-w-md'>
      <h2 className='text-2xl font-bold mb-4 flex items-center gap-2 font-orbitron text-gray-200'>
        <FaChartPie className='text-purpleb' /> expense chart
      </h2>

      {/* Filter Dropdown */}
      <div className='flex justify-end mb-4'>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className='p-2 border rounded  bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-purplea'
        >
          <option value='All'>All</option>
          <option value='Revenue'>Revenue</option>
          <option value='Expenses'>Expenses</option>
          <option value='Subscription'>Subscriptions</option>
        </select>
      </div>

      {/* Doughnut Chart */}
      <div className='flex justify-center items-center'>
        <Pie
          data={chartData}
          options={{
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  color: '#fff',
                  font: {
                    size: 14,
                  },
                },
              },
            },
            maintainAspectRatio: true,
          }}
        />
      </div>
    </div>
  );
};

export default ExpenseChart;
