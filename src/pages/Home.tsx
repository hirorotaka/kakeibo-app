import { Box } from '@mui/material';
import MonthlySummary from '../components/MonthlySummary';
import Calendar from '../components/Calendar';
import TransactionMenu from '../components/TransactionMenu';
import TransactionForm from '../components/TransactionForm';
import { useState } from 'react';
import { format } from 'date-fns';
import useMonthlyTransactions from '../hooks/useMonthlyTransactions';

const Home = () => {
  const monthlyTransactions = useMonthlyTransactions();

  const today = format(new Date(), 'yyyy-MM-dd');
  const [currentDay, setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);

  // 1日分のデータを取得する
  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return transaction.date === currentDay;
  });

  const closeForm = () => {
    setIsEntryDrawerOpen(!isEntryDrawerOpen);
  };

  const handleAddTransactionForm = () => {
    setIsEntryDrawerOpen(!isEntryDrawerOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 左側コンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary />
        <Calendar
          setCurrentDay={setCurrentDay}
          currentDay={currentDay}
          today={today}
        />
      </Box>
      {/* 右側コンテンツ */}
      <Box>
        <TransactionMenu
          dailyTransactions={dailyTransactions}
          currentDay={currentDay}
          onAddTransactionForm={handleAddTransactionForm}
        />
        <TransactionForm
          onCloseForm={closeForm}
          isEntryDrawerOpen={isEntryDrawerOpen}
          currentDay={currentDay}
        />
      </Box>
    </Box>
  );
};

export default Home;
