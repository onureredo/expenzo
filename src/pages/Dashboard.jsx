import AddExpense from '../components/Expenses/AddExpense';
import DetailedExpenseView from '../components/Expenses/DetailedExpenseView';
import ExpenseChart from '../components/Expenses/ExpenseChart';
import Navbar from '../components/Nav/Navbar';
import { ExpenseProvider } from '../context/ExpenseProvider';

const Dashboard = () => {
  return (
    <div className='bg-zinc-900 min-h-screen'>
      <Navbar />
      <div className='p-6'>
        <div className='flex flex-wrap justify-between gap-6'>
          <ExpenseProvider>
            <AddExpense />
            <ExpenseChart />
            <DetailedExpenseView />
          </ExpenseProvider>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
