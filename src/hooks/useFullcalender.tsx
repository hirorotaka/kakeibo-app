import { Balance, CalenderContent } from '../types';
import { EventContentArg, DatesSetArg } from '@fullcalendar/core';
import { formatCurrency } from '../utils/formatting';

interface useFullcalenderProps {
  dailyBalances: Record<string, Balance>;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

const useFullcalender = ({
  dailyBalances,
  setCurrentMonth,
}: useFullcalenderProps) => {
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
  return {
    calendarEvents,
    renderEventContent,
    handleDateSet,
  };
};

export default useFullcalender;
