export const classifyCalendars = (calendars, userId) => {
    const myCalendars = calendars.filter((calendar) => calendar.ownerId === userId);
    const sharedCalendars = calendars.filter((calendar) => calendar.ownerId !== userId);
    return { myCalendars, sharedCalendars };
  };