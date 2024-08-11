import { Box, Button } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ja } from 'date-fns/locale';

const MonthSelector = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Button color={'error'} variant="contained">
          先月
        </Button>
        <DatePicker
          label="年月を選択"
          sx={{ mx: 2, backgroundColor: 'white' }}
          views={['year', 'month']}
          format="yyyy/MM"
          slotProps={{
            toolbar: { toolbarFormat: 'yyy/MM', hidden: false },
            calendarHeader: { format: 'yyyy/MM' },
          }}
        />
        <Button color={'primary'} variant="contained">
          翌月
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default MonthSelector;
