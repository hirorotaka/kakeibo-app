import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import '../style/calendar.css';
import { Transaction } from '../types';
import { calculateDailyBalance } from '../utils/financeCalculations';
import useFullcalender from '../hooks/useFullcalender';
import interactionPlugin from '@fullcalendar/interaction';
interface CalendarProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  currentDay: string;
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
}

const Calendar = ({
  monthlyTransactions,
  setCurrentMonth,
  setCurrentDay,
  currentDay,
}: CalendarProps) => {
  // 日付ごとの収支を計算する
  const dailyBalances = calculateDailyBalance(monthlyTransactions);

  const {
    calendarEvents,
    renderEventContent,
    handleDateSet,
    handleDateClick,
    backgroundEvent,
  } = useFullcalender({
    dailyBalances,
    setCurrentMonth,
    setCurrentDay,
    currentDay,
  });

  return (
    <div>
      <FullCalendar
        locale={jaLocale}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={[...calendarEvents, backgroundEvent]}
        eventContent={renderEventContent}
        datesSet={handleDateSet}
        dateClick={handleDateClick}
      />
    </div>
  );
};

export default Calendar;
