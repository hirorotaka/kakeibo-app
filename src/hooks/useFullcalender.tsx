import { Balance, CalenderContent } from '../types';
import { EventContentArg, DatesSetArg } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';
import { formatCurrency } from '../utils/formatting';
import { useTheme } from '@mui/material';
import { isSameMonth } from 'date-fns';

interface useFullcalenderProps {
  dailyBalances: Record<string, Balance>;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  setCurrentDay: React.Dispatch<React.SetStateAction<string>>;
  currentDay: string;
  today: string;
}

const useFullcalender = ({
  dailyBalances,
  setCurrentMonth,
  setCurrentDay,
  currentDay,
  today,
}: useFullcalenderProps) => {
  const theme = useTheme();
  // FullCalendar用のイベントを生成する関数
  const createCalendarEvents = (
    dailyBalances: Record<string, Balance>
  ): CalenderContent[] => {
    return Object.keys(dailyBalances).map((date) => {
      const { income, expense, balance } = dailyBalances[date];
      return {
        start: date,
        income: formatCurrency(income),
        expense: formatCurrency(expense),
        balance: formatCurrency(balance),
      };
    });
  };

  const calendarEvents = createCalendarEvents(dailyBalances);

  // イベントの内容を表示する関数
  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <>
        <div>
          <div className="money" id="event-income">
            {eventInfo.event.extendedProps.income}
          </div>
          <div className="money" id="event-expense">
            {eventInfo.event.extendedProps.expense}
          </div>
          <div className="money" id="event-balance">
            {eventInfo.event.extendedProps.balance}
          </div>
        </div>
        <b></b>
      </>
    );
  };

  // 現在の月を選択したときの処理
  const handleDateSet = (datesetInfo: DatesSetArg) => {
    const currentMonth = datesetInfo.view.currentStart;
    setCurrentMonth(currentMonth);
    const todayDate = new Date();
    if (isSameMonth(todayDate, currentMonth)) {
      setCurrentDay(today);
    }
  };

  // 現在の日付を選択したときの処理
  const handleDateClick = (dateInfo: DateClickArg) => {
    setCurrentDay(dateInfo.dateStr);
  };

  // イベントの色を設定する関数
  const backgroundEvent = {
    start: currentDay,
    display: 'background',
    backgroundColor: theme.palette.incomeColor.light,
  };

  return {
    calendarEvents,
    renderEventContent,
    handleDateSet,
    handleDateClick,
    backgroundEvent,
  };
};

export default useFullcalender;
