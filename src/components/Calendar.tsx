import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import '../style/calendar.css';
import { Transaction } from '../types';
import { calculateDailyBalance } from '../utils/financeCalculations';
import useFullcalender from '../hooks/useFullcalender';

interface CalendarProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

const Calendar = ({ monthlyTransactions, setCurrentMonth }: CalendarProps) => {
  // 日付ごとの収支を計算する
  const dailyBalances = calculateDailyBalance(monthlyTransactions);

  const { calendarEvents, renderEventContent, handleDateSet } = useFullcalender(
    { dailyBalances, setCurrentMonth }
  );

  return (
    <div>
      <FullCalendar
        locale={jaLocale}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        eventContent={renderEventContent}
        datesSet={handleDateSet}
      />
    </div>
  );
};

export default Calendar;
