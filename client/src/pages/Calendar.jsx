
import React, { useState, useEffect,  useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import CreateButton from '../components/CreateButton';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Checkbox,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { Calendar as MiniCalendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../components/Calendar.css";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const [calendars, setCalendars] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [myCalendarsOpen, setMyCalendarsOpen] = useState(true);
  const [otherCalendarsOpen, setOtherCalendarsOpen] = useState(true);
  const { userId } = useContext(UserContext);

//   const [calendars, setCalendars] = useState([
//     { id: 1, name: "Personal Calendar", isVisible: true, events: [] },
//     { id: 2, name: "Tasks", isVisible: true, events: [] },
//   ]);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const toggleMyCalendars = () => setMyCalendarsOpen(!myCalendarsOpen);
  const toggleOtherCalendars = () => setOtherCalendarsOpen(!otherCalendarsOpen);

  const handleMiniCalendarChange = (date) => setCurrentDate(date);
  // fetch calendars dynamically from  backend +  create default ones if needed
  useEffect(() => {
    const fetchAndCreateDefaultCalendars = async () => {
      if (!userId) {
        console.error("userId is null. Cannot fetch calendars.");
        return;
      }
  
      try {
        // fetch user's calendars
        const response = await fetch(`/calendars?ownerId=${userId}`); // userId is mapped to ownerId
        if (!response.ok) {
          throw new Error(`Failed to fetch calendars: ${response.status}`);
        }
  
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response type: Expected JSON");
        }
  
        const data = await response.json();
  
        // check for default calendars
        const hasPersonalCalendar = data.calendars.some(
          (calendar) => calendar.name === "Personal Calendar"
        );
        const hasTaskCalendar = data.calendars.some(
          (calendar) => calendar.name === "Tasks"
        );
  
        // create missing default calendars
        if (!hasPersonalCalendar || !hasTaskCalendar) {
          const missingCalendars = [];
          if (!hasPersonalCalendar) {
            missingCalendars.push({ name: "Personal Calendar", ownerId: userId });
          }
          if (!hasTaskCalendar) {
            missingCalendars.push({ name: "Tasks", ownerId: userId });
          }
  
          await Promise.all(
            missingCalendars.map((calendar) =>
              fetch("/calendars", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(calendar),
              })
            )
          );
  
          // re-fetch updated calendars
          const updatedResponse = await fetch(`/calendars?ownerId=${userId}`);
          if (updatedResponse.ok) {
            const updatedData = await updatedResponse.json();
            setCalendars(
              updatedData.calendars.map((cal) => ({
                id: cal.CALENDARID,
                name: cal.CALENDARNAME,
                isVisible: true,
                events: [],
              }))
            );
          }
        } else {
          // Set existing calendars
          setCalendars(
            data.calendars.map((cal) => ({
              id: cal.CALENDARID,
              name: cal.CALENDARNAME,
              isVisible: true,
              events: [],
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching or creating default calendars:", error);
      }
    };
  
    fetchAndCreateDefaultCalendars();
  }, [userId]);
  

  const addEvent = (newEvent) => {
    setCalendars((prevCalendars) =>
      prevCalendars.map((cal) =>
        cal.id === newEvent.calendarId
          ? { ...cal, events: [...cal.events, newEvent] }
          : cal
      )
    );
  };

  const addTask = (newTask) => {
    setCalendars((prevCalendars) =>
      prevCalendars.map((cal) =>
        cal.name === "Tasks"
          ? { ...cal, events: [...cal.events, newTask] }
          : cal
      )
    );
  };
  
  const visibleEvents = calendars
    .filter((cal) => cal.isVisible)
    .flatMap((cal) => cal.events);

  return (
    <Box className="calendar-container">
      {/* Header */}
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
          <CreateButton
            calendars={calendars}
            onEventSubmit={addEvent}
            onTaskSubmit={addTask}
          />
        </Grid>
      </Grid>

      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box className="drawer-content">
          <Box className="mini-calendar">
            <MiniCalendar
              value={currentDate}
              onChange={handleMiniCalendarChange}
              minDetail="month"
              next2Label={null}
              prev2Label={null}
            />
          </Box>
          <List className="drawer-list">
            {/* My Calendars */}
            <ListItem button onClick={toggleMyCalendars}>
              <ListItemText primary="My Calendars" />
              {myCalendarsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={myCalendarsOpen} timeout="auto" unmountOnExit>
              {calendars.map((calendar) => (
                <ListItem key={calendar.id} className="drawer-list-item">
                  <Checkbox
                    checked={calendar.isVisible}
                    onChange={() =>
                      setCalendars((prevCalendars) =>
                        prevCalendars.map((cal) =>
                          cal.id === calendar.id
                            ? { ...cal, isVisible: !cal.isVisible }
                            : cal
                        )
                      )
                    }
                  />
                  <ListItemText primary={calendar.name} />
                </ListItem>
              ))}
            </Collapse>
          </List>
        </Box>
      </Drawer>

      {/* Main Calendar */}
      <Box className="calendar-content">
        <BigCalendar
          localizer={localizer}
          events={visibleEvents}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          style={{ height: "80vh" }}
        />
      </Box>
    </Box>
  );
};

export default CalendarPage;
