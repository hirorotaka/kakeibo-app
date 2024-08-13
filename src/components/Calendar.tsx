import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import '../style/calendar.css';
import { calculateDailyBalance } from '../utils/financeCalculations';
import useFullcalender from '../hooks/useFullcalender';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import useMonthlyTransactions from '../hooks/useMonthlyTransactions';
import { useAppContext } from '../context/AppContext';
interface CalendarProps {
  currentDay: string;
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
  today: string;
  onDateClick: (dateInfo: DateClickArg) => void;
}

const Calendar = ({
  setCurrentDay,
  currentDay,
  today,
  onDateClick,
}: CalendarProps) => {
  const monthlyTransactions = useMonthlyTransactions();
  const { setCurrentMonth } = useAppContext();
  // 日付ごとの収支を計算する
  const dailyBalances = calculateDailyBalance(monthlyTransactions);

  const { calendarEvents, renderEventContent, handleDateSet, backgroundEvent } =
    useFullcalender({
      dailyBalances,
      setCurrentMonth,
      setCurrentDay,
      currentDay,
      today,
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
        dateClick={onDateClick}
      />
    </div>
  );
};

export default Calendar;
