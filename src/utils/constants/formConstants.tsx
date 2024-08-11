import FastfoodIcon from '@mui/icons-material/Fastfood'; //食事アイコン
import AlarmIcon from '@mui/icons-material/Alarm'; //日用品アイコン
import AddHomeIcon from '@mui/icons-material/AddHome'; //住居費アイコン
import Diversity3Icon from '@mui/icons-material/Diversity3'; //交際費アイコン
import SportsTennisIcon from '@mui/icons-material/SportsTennis'; //娯楽アイコン

import WorkIcon from '@mui/icons-material/Work'; //給与アイコン
import AddBusinessIcon from '@mui/icons-material/AddBusiness'; //副収入アイコン
import SavingsIcon from '@mui/icons-material/Savings'; //お小遣いアイコン
import { ExpenseCategory, IncomeCategory } from '../../types';

interface CategoryItem {
  label: IncomeCategory | ExpenseCategory;
  icon: JSX.Element;
}

export const formWidth = 320;

export const expenseCategories: CategoryItem[] = [
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
export const incomeCategories: CategoryItem[] = [
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
