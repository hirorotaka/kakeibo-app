import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
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
import React, { useEffect, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close'; // 閉じるボタン用のアイコン
import FastfoodIcon from '@mui/icons-material/Fastfood'; //食事アイコン
import AlarmIcon from '@mui/icons-material/Alarm'; //日用品アイコン
import AddHomeIcon from '@mui/icons-material/AddHome'; //住居費アイコン
import Diversity3Icon from '@mui/icons-material/Diversity3'; //交際費アイコン
import SportsTennisIcon from '@mui/icons-material/SportsTennis'; //娯楽アイコン

import WorkIcon from '@mui/icons-material/Work'; //給与アイコン
import AddBusinessIcon from '@mui/icons-material/AddBusiness'; //副収入アイコン
import SavingsIcon from '@mui/icons-material/Savings'; //お小遣いアイコン

import { zodResolver } from '@hookform/resolvers/zod';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ExpenseCategory, IncomeCategory, Transaction } from '../types';
import { Schema, TransactionSchema } from '../validations/schema';
import { useAppContext } from '../context/AppContext';

interface TransactionFormProps {
  onCloseForm: () => void;
  isEntryDrawerOpen: boolean;
  currentDay: string;
  selectedTransaction: Transaction | null;
  setSelectedTransaction: React.Dispatch<
    React.SetStateAction<Transaction | null>
  >;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type IncomeExpenseType = 'income' | 'expense';

interface CategoryItem {
  label: IncomeCategory | ExpenseCategory;
  icon: JSX.Element;
}

const TransactionForm = ({
  onCloseForm,
  isEntryDrawerOpen,
  currentDay,
  selectedTransaction,
  setSelectedTransaction,
  isDialogOpen,
  setIsDialogOpen,
}: TransactionFormProps) => {
  const {
    onSaveTransaction,
    onDeleteTransaction,
    onUpdateTransaction,
    isMobile,
  } = useAppContext();
  const formWidth = 320;

  const expenseCategories: CategoryItem[] = [
    {
      label: '食費',
      icon: <FastfoodIcon fontSize="small" />,
    },
    {
      label: '日用品',
      icon: <AlarmIcon fontSize="small" />,
    },
    {
      label: '住居費',
      icon: <AddHomeIcon fontSize="small" />,
    },
    {
      label: '交際費',
      icon: <Diversity3Icon fontSize="small" />,
    },
    {
      label: '娯楽',
      icon: <SportsTennisIcon fontSize="small" />,
    },
  ];
  const incomeCategories: CategoryItem[] = [
    {
      label: '給与',
      icon: <WorkIcon fontSize="small" />,
    },
    {
      label: '副収入',
      icon: <SavingsIcon fontSize="small" />,
    },
    {
      label: 'お小遣い',
      icon: <AddBusinessIcon fontSize="small" />,
    },
  ];

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
      amount: 0,
      category: '' as IncomeCategory | ExpenseCategory,
      content: '',
    },
    resolver: zodResolver(TransactionSchema),
  });

  const [categories, setCategories] = useState(expenseCategories);

  const incomeExpenseToggle = (type: IncomeExpenseType): void => {
    setValue('type', type);
    setValue('category', '' as IncomeCategory | ExpenseCategory);
  };

  const currentType = watch('type');

  useEffect(() => {
    const newCategories =
      currentType === 'income' ? incomeCategories : expenseCategories;
    setCategories(newCategories);
    setValue('category', '' as IncomeCategory | ExpenseCategory);
  }, [currentType]);

  useEffect(() => {
    setValue('date', currentDay);
  }, [currentDay]);

  const onSubmit: SubmitHandler<Schema> = (data) => {
    console.log(data);

    if (selectedTransaction) {
      onUpdateTransaction(data, selectedTransaction.id)
        .then(() => {
          // console.log('更新しました');
          setSelectedTransaction(null);
          if (isMobile) {
            setIsDialogOpen(false);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      onSaveTransaction(data)
        .then(() => {
          console.log('保存しました');
        })
        .catch((err) => {
          console.error(err);
        });
    }

    reset({
      type: 'expense',
      date: currentDay,
      amount: 0,
      category: '' as IncomeCategory | ExpenseCategory,
      content: '',
    });
  };

  useEffect(() => {
    if (selectedTransaction) {
      const categoryExisits = categories.some(
        (category) => category.label === selectedTransaction.category
      );
      setValue(
        'category',
        categoryExisits
          ? selectedTransaction.category
          : ('' as IncomeCategory | ExpenseCategory)
      );
    }
  }, [selectedTransaction, categories]);

  useEffect(() => {
    if (selectedTransaction) {
      setValue('type', selectedTransaction.type);
      setValue('date', selectedTransaction.date);
      setValue('amount', selectedTransaction.amount);
      setValue('content', selectedTransaction.content);
    } else {
      reset({
        type: 'expense',
        date: currentDay,
        amount: 0,
        category: '' as IncomeCategory | ExpenseCategory,
        content: '',
      });
    }
  }, [selectedTransaction]);

  const handleDelete = () => {
    if (selectedTransaction) {
      onDeleteTransaction(selectedTransaction.id);
      if (isMobile) {
        setIsDialogOpen(false);
      }
      setSelectedTransaction(null);
    }

    reset({
      type: 'expense',
      date: currentDay,
      amount: 0,
      category: '' as IncomeCategory | ExpenseCategory,
      content: '',
    });
  };

  const formContent = (
    <>
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
                  onClick={() => incomeExpenseToggle('income')}
                  variant={field.value === 'income' ? 'contained' : 'outlined'}
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
                InputLabelProps={{ shrink: true }}
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
                error={!!errors.amount}
                helperText={errors.amount?.message}
                {...field}
                value={field.value === 0 ? '' : field.value}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value, 10) || 0;
                  field.onChange(newValue);
                }}
                label="金額"
                type="number"
              />
            )}
          />
          {/* 内容 */}
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.content}
                helperText={errors.content?.message}
                {...field}
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
    </>
  );

  return (
    <>
      {isMobile ? (
        // モバイル版
        <Dialog
          open={isDialogOpen}
          onClose={onCloseForm}
          fullWidth
          maxWidth="sm"
        >
          <DialogContent>{formContent}</DialogContent>
        </Dialog>
      ) : (
        // PC版
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
          {formContent}
        </Box>
      )}
    </>
  );
};
export default TransactionForm;
