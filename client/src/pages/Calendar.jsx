import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import CreateButton from "../components/CreateButton";
import CalendarMenu from "../components/CalendarMenu";
import { getPermissions } from "../components/CalAccessLevel";

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
import { Snackbar, Alert } from "@mui/material";



const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [calendars, setCalendars] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); 

  useEffect(() => {
    const fetchCalendarsWithEvents = async () => {
      if (!userId) {
       
        return;
      }
  
      try {
        const calendarResponse = await fetch(
          `http://127.0.0.1:8080/calendar?userId=${userId}`
        );
        if (!calendarResponse.ok) throw new Error("Failed to fetch calendars");
  
        const { calendars } = await calendarResponse.json();
        const ownedCalendars = calendars.filter(
          (cal) => cal.accessLevel === "OWNER" || cal.accessLevel === "MANAGE"
        );
        const shared = calendars.filter(
          (cal) => cal.accessLevel !== "OWNER" && cal.accessLevel !== "MANAGE"
        );
  
        // Ensure all owned calendars are visible by default
        const formattedOwnedCalendars = await Promise.all(
          ownedCalendars.map(async (calendar) => {
            const { id, name } = calendar;
            const eventResponse = await fetch(
              `http://127.0.0.1:8080/events?calendarId=${id}`
            );
            const { events = [] } = eventResponse.ok
              ? await eventResponse.json()
              : {};
            return {
              id,
              name,
              isVisible: true, // Default to visible
              events: events.map((event) => ({
                id: event.id,
                title: event.title,
                start: new Date(event.start),
                end: new Date(event.end),
                description: event.description,
                calendarId: id,
              })),
            };
          })
        );
        const formattedSharedCalendars = await Promise.all(
          shared.map(async (calendar) => {
            const { id, name, accessLevel } = calendar;
            const eventResponse = await fetch(
              `http://127.0.0.1:8080/events?calendarId=${id}`
            );
            const { events = [] } = eventResponse.ok
              ? await eventResponse.json()
              : {};
        
            return {
              id,
              name,
              accessLevel,
              isVisible: true, // Default to visible
              events: events.map((event) => ({
                id: event.id,
                title: event.title,
                start: new Date(event.start),
                end: new Date(event.end),
                description: event.description,
                calendarId: id,
              })),
            };
          })
        );

      setCalendars(formattedOwnedCalendars);
      setSharedCalendars(formattedSharedCalendars);
  
    } catch (error) {
      
      showSnackbar("Failed to load calendars. Try again later.");
    }
  };
  
    fetchCalendarsWithEvents();
  }, [userId]);
  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const shareCalendar = async (calendarId, userToShareWith, accessLevel) => {
    try {
      const payload = { calendarId, userId: userToShareWith, accessLevel };
      const response = await fetch("http://127.0.0.1:8080/calendar/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showSnackbar("Calendar shared successfully!");
      } else {
        const error = await response.json();
        showSnackbar(`Failed to share calendar: ${error.ERROR || "Unknown error"}`);
      }
    } catch (error) {
   
      showSnackbar("Error connecting to the server. Please try again later.");
    }
  };

  const handleSelectEvent = (event) => {
    const calendar = [...calendars, ...sharedCalendars].find(
      (cal) => cal.id === event.calendarId
    );
    const permissions = getPermissions(calendar?.accessLevel);
  
    if (!permissions.canViewEvents) {
      showSnackbar("You do not have permission to view this event.");
      return;
    }
  
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.description);
    setEventStart(event.start);
    setEventEnd(event.end);
  
    if (permissions.canEditEvents) {
      setEventDialogOpen(true); // Only open dialog if the user can edit
    }
  };
  const handleSaveEvent = async () => {
    const calendar = [...calendars, ...sharedCalendars].find(
      (cal) => cal.id === selectedEvent.calendarId
    );
    const permissions = getPermissions(calendar?.accessLevel);
  
    if (!permissions.canEditEvents) {
      showSnackbar("You do not have permission to edit this event.");
      return;
    }
  
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
        showSnackbar("Failed to update event.");
      }
    } catch (error) {
  
      showSnackbar("Error updating event. Please try again later.");
    }
  };


const handleDeleteEvent = async () => {
  const calendar = [...calendars, ...sharedCalendars].find(
    (cal) => cal.id === selectedEvent.calendarId
  );
  const permissions = getPermissions(calendar?.accessLevel);

  if (!permissions.canDeleteEvents) {
    showSnackbar("You do not have permission to delete this event.");
    return;
  }

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
      showSnackbar("Failed to delete event.");
    }
  } catch (error) {
  
    showSnackbar("Error deleting event. Please try again later.");
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
        showSnackbar("Calendar deleted successfully.");
      } else {
        const error = await response.json();
        showSnackbar(`Failed to delete calendar: ${error.ERROR || "Unknown error"}`);
      }
    } catch (error) {
      showSnackbar("Error deleting calendar. Please try again later.");
    }
  };
  const renameCalendar = async (calendarId, newName) => {
    if (!newName.trim()) {
      showSnackbar("New calendar name cannot be empty.");
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
        showSnackbar("Calendar renamed successfully.");
      } else {
        const error = await response.json();
        showSnackbar(`Failed to rename calendar: ${error.ERROR || "Unknown error"}`);
      }
    } catch (error) {
      showSnackbar("Error renaming calendar. Please try again later.");
    }
  };

  const addCalendar = async (newCalendarName) => {
    if (!newCalendarName.trim()) {
      showSnackbar("Calendar name cannot be empty.");
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
        showSnackbar(`Calendar "${newCalendarName}" created successfully!`);
      } else {
        const error = await response.json();
       
        showSnackbar(`Failed to create calendar: ${error.ERROR || "Unknown error"}`);
      }
    } catch (error) {
      
      showSnackbar("Error connecting to the server. Please try again later.");
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
     
    }
  };

  const visibleEvents = [...calendars, ...sharedCalendars]
  .filter((calendar) => {
  
    return calendar.isVisible;
  })
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
        setSharedCalendars={setSharedCalendars}
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
      <Snackbar
        open={snackbarOpen}
          autoHideDuration={6000} // 6 seconds
          onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
       {snackbarMessage}
        </Alert>
    </Snackbar>

    </Box>
    
  );
};

export default CalendarPage;