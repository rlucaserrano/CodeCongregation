import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import CreateButton from "../components/CreateButton";
import CalendarMenu from "../components/CalendarMenu";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../components/Calendar.css";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [calendars, setCalendars] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Event dialog states
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventStart, setEventStart] = useState(new Date());
  const [eventEnd, setEventEnd] = useState(new Date());

  const { user } = useContext(UserContext);
  const userId = user?.userId;

  const [sharedCalendars, setSharedCalendars] = useState([]);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  // Fetch calendars and events
  useEffect(() => {
    const fetchCalendarsWithEvents = async () => {
      if (!userId) {
        console.error("User ID is not available. Unable to fetch calendars.");
        return;
      }

      try {
        const calendarResponse = await fetch(
          `http://127.0.0.1:8080/calendar?userId=${userId}`
        );
        if (!calendarResponse.ok) {
          throw new Error(`Failed to fetch calendars: ${calendarResponse.status}`);
        }

        const calendarData = await calendarResponse.json();

        // Separate owned and shared calendars
        const ownedCalendars = calendarData.calendars.filter(
          (cal) => cal.accessLevel === "OWNER" || cal.accessLevel === "MANAGE"
        );
        const shared = calendarData.calendars.filter(
          (cal) => cal.accessLevel !== "OWNER" && cal.accessLevel !== "MANAGE"
        );

        // Fetch events for owned calendars
        const formattedOwnedCalendars = await Promise.all(
          ownedCalendars.map(async (calendar) => {
            const { id, name, ownerId } = calendar;

            const eventResponse = await fetch(
              `http://127.0.0.1:8080/events?calendarId=${id}`
            );
            let events = [];
            if (eventResponse.ok) {
              const eventData = await eventResponse.json();
              if (eventData.events && Array.isArray(eventData.events)) {
                events = eventData.events.map((event) => ({
                  id: event.id,
                  title: event.title,
                  start: new Date(event.start),
                  end: new Date(event.end),
                  description: event.description,
                  calendarId: id,
                }));
              }
            }

            return {
              id,
              name,
              ownerId,
              isVisible: true,
              events,
            };
          })
        );

        setCalendars(formattedOwnedCalendars);
        setSharedCalendars(shared);
      } catch (error) {
        console.error("Error fetching calendars and events:", error);
        alert("Failed to load calendars and events. Please try again later.");
      }
    };

    fetchCalendarsWithEvents();
  }, [userId]);
  const shareCalendar = async (calendarId, userToShareWith, accessLevel) => {
    try {
      const payload = { calendarId, userId: userToShareWith, accessLevel };
      const response = await fetch("http://127.0.0.1:8080/calendar/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Calendar shared successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to share calendar: ${error.ERROR || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error sharing calendar:", error);
      alert("Error connecting to the server. Please try again later.");
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.description);
    setEventStart(event.start);
    setEventEnd(event.end);
    setEventDialogOpen(true);
  };

  const handleSaveEvent = async () => {
    try {
      const payload = {
        valEventID: selectedEvent.id,
        valEventName: eventTitle,
        valEventDescription: eventDescription,
        valStartDate: eventStart.toISOString().split("T")[0],
        valStartTime: eventStart.toISOString().split("T")[1].slice(0, 5),
        valEndDate: eventEnd.toISOString().split("T")[0],
        valEndTime: eventEnd.toISOString().split("T")[1].slice(0, 5),
      };

      const response = await fetch("http://127.0.0.1:8080/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedEvent = {
          ...selectedEvent,
          title: eventTitle,
          description: eventDescription,
          start: eventStart,
          end: eventEnd,
        };

        setCalendars((prevCalendars) =>
          prevCalendars.map((calendar) =>
            calendar.id === updatedEvent.calendarId
              ? {
                  ...calendar,
                  events: calendar.events.map((ev) =>
                    ev.id === updatedEvent.id ? updatedEvent : ev
                  ),
                }
              : calendar
          )
        );
        setEventDialogOpen(false);
      } else {
        alert("Failed to update event.");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Error updating event. Please try again later.");
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/events`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valEventID: selectedEvent.id }),
      });

      if (response.ok) {
        setCalendars((prevCalendars) =>
          prevCalendars.map((calendar) =>
            calendar.id === selectedEvent.calendarId
              ? {
                  ...calendar,
                  events: calendar.events.filter(
                    (ev) => ev.id !== selectedEvent.id
                  ),
                }
              : calendar
          )
        );
        setEventDialogOpen(false);
      } else {
        alert("Failed to delete event.");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error deleting event. Please try again later.");
    }
  };

  const addEvent = (newEvent) => {
    setCalendars((prevCalendars) =>
      prevCalendars.map((calendar) =>
        calendar.id === newEvent.calendarId
          ? { ...calendar, events: [...calendar.events, newEvent] }
          : calendar
      )
    );
  };

  const deleteCalendar = async (calendarId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/calendar/${calendarId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        setCalendars((prevCalendars) =>
          prevCalendars.filter((cal) => cal.id !== calendarId)
        );
        alert("Calendar deleted successfully.");
      } else {
        const error = await response.json();
        alert(`Failed to delete calendar: ${error.ERROR || "Unknown error"}`);
      }
    } catch (error) {
      alert("Error deleting calendar. Please try again later.");
    }
  };
  const renameCalendar = async (calendarId, newName) => {
    if (!newName.trim()) {
      alert("New calendar name cannot be empty.");
      return;
    }
    try {
      const payload = { valCalendarID: calendarId, valCalendarName: newName };
      const response = await fetch(
        `http://127.0.0.1:8080/calendar/${calendarId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        setCalendars((prevCalendars) =>
          prevCalendars.map((cal) =>
            cal.id === calendarId ? { ...cal, name: newName } : cal
          )
        );
        alert("Calendar renamed successfully.");
      } else {
        const error = await response.json();
        alert(`Failed to rename calendar: ${error.ERROR || "Unknown error"}`);
      }
    } catch (error) {
      alert("Error renaming calendar. Please try again later.");
    }
  };

  const addCalendar = async (newCalendarName) => {
    if (!newCalendarName.trim()) {
      alert("Calendar name cannot be empty.");
      return;
    }

    try {
      const payload = { valCalendarName: newCalendarName, valOwnerID: userId };
      const response = await fetch("http://127.0.0.1:8080/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newCalendar = await response.json();
        setCalendars((prevCalendars) => [
          ...prevCalendars,
          {
            id: newCalendar.calendarID,
            name: newCalendarName,
            ownerId: userId,
            isVisible: true,
            events: [],
          },
        ]);
        alert(`Calendar "${newCalendarName}" created successfully!`);
      } else {
        const error = await response.json();
        console.error("Error creating calendar:", error);
        alert(`Failed to create calendar: ${error.ERROR || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating calendar:", error);
      alert("Error connecting to the server. Please try again later.");
    }
  };

  const fetchSharedCalendars = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/calendar?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch shared calendars");
      const data = await response.json();
      const shared = data.calendars.filter((cal) => cal.accessLevel !== "OWNER");
      setSharedCalendars(shared);
    } catch (error) {
      console.error("Error fetching shared calendars:", error);
    }
  };

  useEffect(() => {
    if (userId) fetchSharedCalendars();
  }, [userId]);

  const visibleEvents = calendars
    .filter((calendar) => calendar.isVisible)
    .flatMap((calendar) => calendar.events);

  return (
    <Box className="calendar-container">
      <Grid container alignItems="center" className="calendar-header">
        <Grid item>
          <IconButton onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        </Grid>
        <Grid item xs>
          <Typography variant="h5">Calendar</Typography>
        </Grid>
        <Grid item>
          <CreateButton calendars={calendars} />
        </Grid>
      </Grid>

      <CalendarMenu
        myCalendars={calendars}
        sharedCalendars={sharedCalendars}
        setCalendars={setCalendars}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        drawerOpen={drawerOpen}
        toggleDrawer={toggleDrawer}
        addCalendar={addCalendar}
        renameCalendar={renameCalendar}
        deleteCalendar={deleteCalendar}
        shareCalendar={shareCalendar}
      />

      <Box className="calendar-content">
        <BigCalendar
          localizer={localizer}
          events={visibleEvents}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          onSelectEvent={handleSelectEvent}
          style={{ height: "80vh" }}
        />
      </Box>
      <Dialog open={eventDialogOpen} onClose={() => setEventDialogOpen(false)}>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Time"
            type="datetime-local"
            value={moment(eventStart).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) => setEventStart(new Date(e.target.value))}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Time"
            type="datetime-local"
            value={moment(eventEnd).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) => setEventEnd(new Date(e.target.value))}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteEvent} color="secondary">
            Delete
          </Button>
          <Button onClick={handleSaveEvent} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarPage;