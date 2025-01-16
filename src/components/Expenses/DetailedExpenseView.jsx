import { useState, useEffect, useMemo, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaFileExport, FaWallet } from 'react-icons/fa';
import { useTable } from 'react-table';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import enGb from 'date-fns/locale/en-GB';
import { toast } from 'react-hot-toast';
import { useExpenses } from '../../context/ExpenseProvider';
import { setBudgetGoals } from '../../utils/budget';
import { Discuss } from 'react-loader-spinner';
import { faUpDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
registerLocale('en-GB', enGb);

const DetailedExpenseView = () => {
  const { entries } = useExpenses();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [chartData, setChartData] = useState({
    labels: ['No Data'],
    datasets: [
      {
        label: 'Expense Distribution',
        data: [0],
        backgroundColor: ['#9E9E9E'],
      },
    ],
  });
  const [netAmount, setNetAmount] = useState(0);
  const [aiSuggestions, setAISuggestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const filteredEntries = useMemo(() => {
    const normalizeDate = (date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    let filtered = entries.filter((entry) => {
      const entryDate = new Date(entry.date);

      const normalizedFromDate = fromDate ? normalizeDate(fromDate) : null;
      const normalizedToDate = toDate
        ? new Date(
            toDate.getFullYear(),
            toDate.getMonth(),
            toDate.getDate() + 1
          )
        : null;

      if (selectedCategory !== 'All' && entry.type !== selectedCategory) {
        return false;
      }

      if (normalizedFromDate && entryDate < normalizedFromDate) {
        return false;
      }
      if (normalizedToDate && entryDate >= normalizedToDate) {
        return false;
      }

      return true;
    });

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        if (sortConfig.key === 'amount') {
          const amountA = parseFloat(a.amount);
          const amountB = parseFloat(b.amount);
          return sortConfig.direction === 'asc'
            ? amountA - amountB
            : amountB - amountA;
        } else if (sortConfig.key === 'date') {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        }
        return 0;
      });
    }

    return filtered;
  }, [entries, selectedCategory, fromDate, toDate, sortConfig]);

  const generateChartData = useCallback(() => {
    const revenueTotal = filteredEntries
      .filter((entry) => entry.type === 'Revenue')
      .reduce((acc, entry) => acc + parseFloat(entry.amount || 0), 0);

    const expensesTotal = filteredEntries
      .filter((entry) => entry.type === 'Expenses')
      .reduce((acc, entry) => acc + parseFloat(entry.amount || 0), 0);

    const subscriptionTotal = filteredEntries
      .filter((entry) => entry.type === 'Subscription')
      .reduce((acc, entry) => acc + parseFloat(entry.amount || 0), 0);

    const labels = ['Revenue', 'Expenses', 'Subscription'];
    const dataPoints = [revenueTotal, expensesTotal, subscriptionTotal];
    const backgroundColors = ['#4CAF50', '#EF4444', '#F59E0B'];

    setChartData({
      labels,
      datasets: [
        {
          label: 'Expense Distribution',
          data: dataPoints,
          backgroundColor: backgroundColors,
        },
      ],
    });

    setNetAmount(revenueTotal - (expensesTotal + subscriptionTotal));
  }, [filteredEntries]);

  useEffect(() => {
    generateChartData();
  }, [generateChartData]);

  const handleAIRequest = async () => {
    setLoading(true);
    try {
      const result = await setBudgetGoals(filteredEntries);
      setAISuggestions(result);
    } catch (error) {
      toast.error('Failed to fetch AI suggestions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: (
          <span
            className={`${
              sortConfig.key === 'type' ? 'font-bold text-purplea' : ''
            }`}
            onClick={() => handleSort('type')}
          >
            Type
          </span>
        ),
        accessor: 'type',
        Cell: ({ value }) => {
          const colorMap = {
            Revenue: '#10B981',
            Expenses: '#EF4444',
            Subscription: '#F59E0B',
          };

          return (
            <span style={{ color: colorMap[value] || '#FFF' }}>{value}</span>
          );
        },
      },
      {
        Header: (
          <span
            className={`${
              sortConfig.key === 'description' ? 'font-bold text-purplea' : ''
            }`}
            onClick={() => handleSort('description')}
          >
            Description
          </span>
        ),
        accessor: 'description',
      },
      {
        Header: (
          <span
            className={`cursor-pointer hover:opacity-75 ${
              sortConfig.key === 'amount' ? 'font-bold text-purplea' : ''
            }`}
            onClick={() => handleSort('amount')}
          >
            Price <FontAwesomeIcon icon={faUpDown} />
          </span>
        ),
        accessor: 'amount',
        Cell: ({ value }) => `${parseFloat(value).toFixed(2)} €`,
      },
      {
        Header: (
          <span
            className={`cursor-pointer hover:opacity-75 ${
              sortConfig.key === 'date' ? 'font-bold text-purplea' : ''
            }`}
            onClick={() => handleSort('date')}
          >
            Date <FontAwesomeIcon icon={faUpDown} />
          </span>
        ),
        accessor: 'date',
      },
    ],
    [sortConfig]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: filteredEntries,
    });

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      filteredEntries
        .map((entry) =>
          [
            entry.type,
            entry.amount,
            entry.description || 'N/A',
            entry.date,
          ].join(',')
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'filtered_expense_data.csv');
    link.click();
  };

  return (
    <div className='bg-zinc-900 rounded-lg w-screen mt-6 p-6'>
      <h2 className='text-2xl font-bold text-gray-200 flex items-center gap-2 font-orbitron'>
        <FaWallet className='text-purpleb' /> Detailed Expense List
      </h2>

      <div className='flex flex-wrap gap-4 mt-4 items-center'>
        <div className='max-w-[100px] w-full'>
          <label className='block text-white mb-1'>Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className='p-2 rounded bg-zinc-900 text-white border border-gray-600 w-full'
          >
            <option value='All'>All</option>
            <option value='Revenue'>Revenue</option>
            <option value='Expenses'>Expenses</option>
            <option value='Subscription'>Subscription</option>
          </select>
        </div>

        <div className='max-w-[100px] w-full'>
          <label className='block text-white mb-1'>From</label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            className='p-2 rounded bg-zinc-900 text-white border border-gray-600 w-full'
            dateFormat='dd.MM.yyyy'
            locale='en-GB'
          />
        </div>

        <div className='max-w-[100px] w-full'>
          <label className='block text-white mb-1'>To</label>
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            className='p-2 rounded bg-zinc-900 text-white border border-gray-600 w-full'
            dateFormat='dd.MM.yyyy'
            locale='en-GB'
          />
        </div>

        <div className='relative flex-shrink-0 group'>
          <button
            onClick={handleExportCSV}
            className='bg-purplea text-white p-2 rounded-full hover:bg-purpleb flex items-center justify-center w-9 h-9 mt-6'
          >
            <FaFileExport />
          </button>
          <span className='absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 text-xs text-white bg-zinc-900 rounded shadow-md opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
            Export CSV
          </span>
        </div>
      </div>

      <div className='mt-6'>
        <Bar
          data={chartData}
          options={{
            plugins: {
              legend: { display: true, labels: { color: '#FFF' } },
            },
            scales: {
              x: { grid: { color: '#4A4A4A' }, ticks: { color: '#FFF' } },
              y: { grid: { color: '#4A4A4A' }, ticks: { color: '#FFF' } },
            },
          }}
        />
      </div>

      <div className='mt-6'>
        <div className='flex items-center justify-between my-2'>
          <h3 className='text-lg font-bold text-gray-200 font-orbitron'>
            Detailed View
          </h3>
          <p className='text-lg text-white font-semibold'>
            <span className='font-orbitron'>Balance:</span>{' '}
            <span
              className={`mr-4 ${
                netAmount >= 0 ? 'text-green-500' : 'text-red-500'
              } `}
            >
              {netAmount.toFixed(2)}€
            </span>
          </p>
        </div>
        {filteredEntries.length > 0 ? (
          <div className='overflow-x-auto'>
            <table
              {...getTableProps()}
              className='w-full bg-zinc-900 text-white border-collapse rounded shadow-md border border-gray-700'
            >
              <thead>
                {headerGroups.map((headerGroup, headerIndex) => (
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    key={`header-${headerIndex}`}
                    className='border-b border-gray-700'
                  >
                    {headerGroup.headers.map((column, columnIndex) => (
                      <th
                        {...column.getHeaderProps()}
                        key={`header-col-${headerIndex}-${columnIndex}`}
                        className='p-3 text-left text-purplea'
                      >
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row, rowIndex) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={`row-${rowIndex}`}
                      className='border-b border-gray-700'
                    >
                      {row.cells.map((cell, cellIndex) => (
                        <td
                          {...cell.getCellProps()}
                          key={`cell-${rowIndex}-${cellIndex}`}
                          className='p-3 text-gray-200 text-sm'
                        >
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className='text-gray-400 italic'>No entries found.</p>
        )}
      </div>

      {aiSuggestions && (
        <div className='mt-6 bg-zinc-900 text-white rounded shadow-lg'>
          <h3 className='text-lg font-bold font-orbitron mb-2 border-b-[1px] py-2'>
            AI Feedback
          </h3>
          <p className='italic rounded text-gray-300 p-2'>
            &#34;{aiSuggestions}&#34;
          </p>
        </div>
      )}

      <button
        onClick={handleAIRequest}
        className={`mt-6 w-full rounded font-semibold ${
          loading ? ' text-gray-300 cursor-not-allowed' : ''
        }`}
        disabled={loading}
      >
        {loading ? (
          <div className='flex justify-center items-center h-full'>
            <Discuss
              visible={true}
              height='80'
              width='80'
              ariaLabel='discuss-loading'
              wrapperStyle={{}}
              wrapperClass='discuss-wrapper'
              color='#fff'
              backgroundColor='#F4442E'
            />
          </div>
        ) : (
          <p className='px-4 py-2 font-orbitron bg-purplea text-white rounded-lg bg-gradient-to-r from-indigo-400 to-purplea hover:opacity-70 transition-all duration-300 font-semibold'>
            get AI feedback
          </p>
        )}
      </button>
    </div>
  );
};

export default DetailedExpenseView;
