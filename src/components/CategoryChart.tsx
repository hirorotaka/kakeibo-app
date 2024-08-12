import { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from '@mui/material';
import { ExpenseCategory, IncomeCategory, TransactionType } from '../types';
import useMonthlyTransactions from '../hooks/useMonthlyTransactions';
import { useAppContext } from '../context/AppContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = () => {
  const { isLoading } = useAppContext();
  const monthlyTransactions = useMonthlyTransactions();
  const theme = useTheme();
  const [selectedType, setSelectedType] = useState<TransactionType>('expense');

  const handleChange = (e: SelectChangeEvent<'expense' | 'income'>) => {
    setSelectedType(e.target.value as TransactionType);
  };

  // カテゴリ別の合計金額
  const categorySums = monthlyTransactions
    .filter((transaction) => transaction.type === selectedType)
    .reduce<Record<IncomeCategory | ExpenseCategory, number>>(
      (acc, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0;
        }
        acc[transaction.category] += transaction.amount;
        return acc;
      },
      {} as Record<IncomeCategory | ExpenseCategory, number>
    );

  const categoryLabels = Object.keys(categorySums) as (
    | IncomeCategory
    | ExpenseCategory
  )[];
  const categoryValues = Object.values(categorySums);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

  const incomeCategoryColor: Record<IncomeCategory, string> = {
    給与: theme.palette.incomeCategoryColor.給与,
    副収入: theme.palette.incomeCategoryColor.副収入,
    お小遣い: theme.palette.incomeCategoryColor.お小遣い,
  };

  const expenseCategoryColor: Record<ExpenseCategory, string> = {
    食費: theme.palette.expenseCategoryColor.食費,
    日用品: theme.palette.expenseCategoryColor.日用品,
    住居費: theme.palette.expenseCategoryColor.住居費,
    交際費: theme.palette.expenseCategoryColor.交際費,
    娯楽: theme.palette.expenseCategoryColor.娯楽,
  };

  const getCategoryColor = (
    category: IncomeCategory | ExpenseCategory
  ): string => {
    if (selectedType === 'income') {
      return incomeCategoryColor[category as IncomeCategory];
    } else {
      return expenseCategoryColor[category as ExpenseCategory];
    }
  };

  const data: ChartData<'pie'> = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: categoryLabels.map((category) =>
          getCategoryColor(category)
        ),
        borderColor: categoryLabels.map((category) =>
          getCategoryColor(category)
        ),
        borderWidth: 1,
      },
    ],
  };
  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="type-select-label">収支の種類</InputLabel>
        <Select
          labelId="type-select-label"
          value={selectedType}
          label="収支の種類"
          onChange={handleChange}
        >
          <MenuItem value={'expense'}>支出</MenuItem>
          <MenuItem value={'income'}>収入</MenuItem>
        </Select>
      </FormControl>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : monthlyTransactions.length > 0 ? (
          <Pie data={data} options={options} />
        ) : (
          <Typography>データはありません</Typography>
        )}
      </Box>
    </Box>
  );
};

export default CategoryChart;
