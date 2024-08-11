import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close'; // 閉じるボタン用のアイコン
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Schema, TransactionSchema } from '../validations/schema';
import {
  expenseCategories,
  formWidth,
  incomeCategories,
} from '../utils/constants/formConstants.tsx';
import { useAppContext } from '../context/AppContext.tsx';
import { Transaction } from '../types/index.ts';

interface TransactionFormProps {
  onCloseForm: () => void;
  isEntryDrawerOpen: boolean;
  currentDay: string;
  selectedTransaction: Transaction | null;
  setSelectedTransaction: React.Dispatch<
    React.SetStateAction<Transaction | null>
  >;
}

type IncomeExpenseType = 'income' | 'expense';

const TransactionForm = ({
  onCloseForm,
  isEntryDrawerOpen,
  currentDay,
  selectedTransaction,
  setSelectedTransaction,
}: TransactionFormProps) => {
  const { onSaveTransaction, onDeleteTransaction, onUpdateTransaction } =
    useAppContext();
  const [categories, setCategories] = useState(expenseCategories);
  const {
    control,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<Schema>({
    defaultValues: {
      type: 'expense',
      date: currentDay,
      category: '' as Schema['category'],
      content: '',
      amount: 0,
    },
    resolver: zodResolver(TransactionSchema),
  });

  const onSubmit: SubmitHandler<Schema> = (data) => {
    if (selectedTransaction) {
      onUpdateTransaction(data, selectedTransaction.id)
        .then(() => {
          console.log('更新しました');
          setSelectedTransaction(null);
        })
        .catch((err) => {
          console.error('更新に失敗しました', err);
        });
    } else {
      onSaveTransaction(data)
        .then(() => {
          console.log('更新しました');
          setSelectedTransaction(null);
        })
        .catch((err) => {
          console.error('更新に失敗しました', err);
        });
    }

    reset({
      type: 'expense',
      date: currentDay,
      amount: 0,
      category: '' as Schema['category'],
      content: '',
    });
  };

  // 収支タイプを切り替える
  const incomeExpenseToggle = (type: IncomeExpenseType): void => {
    setValue('type', type);
    setValue('category', '' as Schema['category']);
  };

  const handleDelete = () => {
    if (selectedTransaction) {
      onDeleteTransaction(selectedTransaction.id);
      setSelectedTransaction(null);
    }

    reset({
      type: 'expense',
      date: currentDay,
      amount: 0,
      category: '' as Schema['category'],
      content: '',
    });
  };

  // 収支タイプを監視
  const currentType = watch('type');

  useEffect(() => {
    setValue('date', currentDay);
  }, [currentDay, setValue]);

  useEffect(() => {
    const newCategories =
      currentType === 'income' ? incomeCategories : expenseCategories;
    setCategories(newCategories);
    setValue('category', '' as Schema['category']);
  }, [currentType]);

  useEffect(() => {
    if (selectedTransaction) {
      const categoryExisits = categories.some(
        (category) => category.label === selectedTransaction.category
      );
      setValue(
        'category',
        categoryExisits
          ? selectedTransaction.category
          : ('' as Schema['category'])
      );
    }
  }, [selectedTransaction, categories]);

  useEffect(() => {
    if (selectedTransaction) {
      setValue('type', selectedTransaction.type);
      setValue('date', selectedTransaction.date);
      setValue('content', selectedTransaction.content);
      setValue('amount', selectedTransaction.amount);
    } else {
      reset({
        type: 'expense',
        date: currentDay,
        amount: 0,
        category: '' as Schema['category'],
        content: '',
      });
    }
  }, [selectedTransaction, setValue]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 64,
        right: isEntryDrawerOpen ? formWidth : '-2%', // フォームの位置を調整
        width: formWidth,
        height: '100%',
        bgcolor: 'background.paper',
        zIndex: (theme) => theme.zIndex.drawer - 1,
        transition: (theme) =>
          theme.transitions.create('right', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        p: 2, // 内部の余白
        boxSizing: 'border-box', // ボーダーとパディングをwidthに含める
        boxShadow: '0px 0px 15px -5px #777777',
      }}
    >
      {/* 入力エリアヘッダー */}
      <Box display={'flex'} justifyContent={'space-between'} mb={2}>
        <Typography variant="h6">入力</Typography>
        {/* 閉じるボタン */}
        <IconButton
          onClick={onCloseForm}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {/* フォーム要素 */}
      <Box component={'form'} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* 収支切り替えボタン */}
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <ButtonGroup fullWidth>
                <Button
                  variant={field.value === 'expense' ? 'contained' : 'outlined'}
                  color="error"
                  onClick={() => incomeExpenseToggle('expense')}
                >
                  支出
                </Button>
                <Button
                  variant={field.value === 'income' ? 'contained' : 'outlined'}
                  onClick={() => incomeExpenseToggle('income')}
                >
                  収入
                </Button>
              </ButtonGroup>
            )}
          />
          {/* 日付 */}
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="日付"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            )}
          />
          {/* カテゴリ */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel id="category-select-label">カテゴリ</InputLabel>
                <Select
                  {...field}
                  labelId="category-select-label"
                  id="category-select"
                  label="カテゴリ"
                >
                  {categories.map((category, index) => (
                    <MenuItem value={category.label} key={index}>
                      <ListItemIcon>{category.icon}</ListItemIcon>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.category?.message}</FormHelperText>
              </FormControl>
            )}
          />
          {/* 金額 */}
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value === 0 ? '' : field.value}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value, 10) || 0;
                  field.onChange(newValue);
                }}
                label="金額"
                type="number"
                error={!!errors.amount}
                helperText={errors.amount?.message}
              />
            )}
          />

          {/* 内容 */}
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.content}
                helperText={errors.content?.message}
                label="内容"
                type="text"
              />
            )}
          />
          {/* 保存ボタン */}
          <Button
            type="submit"
            variant="contained"
            color={currentType === 'income' ? 'primary' : 'error'}
            fullWidth
          >
            {selectedTransaction ? '更新' : '保存'}
          </Button>

          {selectedTransaction && (
            <Button
              onClick={handleDelete}
              variant="outlined"
              color={'secondary'}
              fullWidth
            >
              削除
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
export default TransactionForm;
