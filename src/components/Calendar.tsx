import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import { EventContentArg, DatesSetArg } from '@fullcalendar/core';
import '../style/calendar.css';
import { Balance, CalenderContent, Transaction } from '../types';
import { calculateDailyBalance } from '../utils/financeCalculations';
import { formatCurrency } from '../utils/formatting';

interface CalendarProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

const Calendar = ({ monthlyTransactions, setCurrentMonth }: CalendarProps) => {
  // 日付ごとの収支を計算する
  const dailyBalances = calculateDailyBalance(monthlyTransactions);

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

  const handleDateSet = (datesetInfo: DatesSetArg) => {
    const currentMonth = datesetInfo.view.currentStart;
    setCurrentMonth(currentMonth);
  };

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
