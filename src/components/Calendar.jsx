import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

const localizer = momentLocalizer(moment);

const Calendar = ({ events, onSelectEvent, eventStyleGetter }) => {
  return (
    <div className="calendar-container" style={{ height: '90vh', width: '100%' }}>
      {events.length === 0 ? (
        <p>No events to display</p>
      ) : (
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="Notes"
          style={{ height: '100%', width: '100%' }}
          onSelectEvent={onSelectEvent}
          eventPropGetter={eventStyleGetter}
        />
      )}
    </div>
  );
};

export default Calendar;