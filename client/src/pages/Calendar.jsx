import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Container, Paper, Typography, Button, Switch, Grid2 } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import TextField from '@mui/material/TextField';
import "../assets/arrange.css"; // Ensure this file exists

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showOnlyScheduled, setShowOnlyScheduled] = useState(false);

  // Dummy events, replace with your data source
  const events = [
    { start: new Date(), end: new Date(moment().add(1, "hours")), title: "Sample Event" },
    { start: new Date(moment().add(1, "days")), end: new Date(moment().add(1, "days").add(1, "hours")), title: "Another Event" }
  ];

  // Handler to go to the previous month
  const goToPreviousMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, "months").toDate());
  };

  // Handler to go to the next month
  const goToNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, "months").toDate());
  };

  // Handler for Google Calendar integration
  const integrateWithGoogleCalendar = () => {
    window.open("https://calendar.google.com", "_blank"); // This opens Google Calendar in a new tab
  };

  // Toggle empty slots
  const handleSliderChange = () => {
    setShowOnlyScheduled(!showOnlyScheduled);
  };

  // Function to calculate the earliest and latest time with events
  const getMinAndMaxTimes = (events) => {
    if (events.length === 0) return { minTime: new Date(0, 0, 0, 0, 0), maxTime: new Date(0, 0, 0, 23, 59) };

    const times = events.flatMap(event => [event.start, event.end]);
    const minTime = new Date(Math.min(...times.map(time => time.getTime())));
    const maxTime = new Date(Math.max(...times.map(time => time.getTime())));
    
    return { minTime, maxTime };
  };

  const [openT, setOpenT] = React.useState(false);

    const handleClickOpenT = () => {
        setOpenT(true);
    };

    const handleCloseT = () => {
        setOpenT(false);
    };

    const [openN, setOpenN] = React.useState(false);

    const handleClickOpenN = () => {
        setOpenN(true);
    };

    const handleCloseN = () => {
        setOpenN(false);
    };

  // Set min and max time for calendar based on events when slider is on
  const { minTime, maxTime } = showOnlyScheduled ? getMinAndMaxTimes(events) : { minTime: new Date(0, 0, 0, 0, 0), maxTime: new Date(0, 0, 0, 23, 59) };

  return (
    <Container>
      <h1> Calendar </h1>
      {/* Controls */}
      <Grid2 container spacing={2} alignItems="center" justifyContent="space-between">
        {/* Left Side Controls */}
        <Grid2 item>
          <Button variant="contained" color="primary" onClick={integrateWithGoogleCalendar}>
            Integrate with Google Calendar
          </Button>
        </Grid2>
        <Grid2 item>
                    <Button sx={{color:'#000'}} onClick={handleClickOpenT} variant="contained" color="secondary">Add Task</Button>
                    <Dialog open={openT} onClose={handleCloseT}>
                        <DialogTitle>Add a new task:</DialogTitle>
                        <TextField id="TaskTime" type="datetime-local" defaultValue = ""/>
                        <TextField id="TaskDesc" label="Input task" defaultValue = ""/>
                        <Button variant='contained' onClick={handleCloseT} style={{textTransform: 'none'}}>Done</Button>
                    </Dialog>
        </Grid2>
        <Grid2 item>
        <Button sx={{color:'#000'}} onClick={handleClickOpenN} variant="contained" color="secondary">Add New Calendar</Button>
                    <Dialog open={openN} onClose={handleCloseN}>
                        <DialogTitle>Create a new calendar:</DialogTitle>
                        <TextField id="CalName" label="Input Calendar Name:" defaultValue = ""/>
                        <Button variant='contained' onClick={handleCloseN} style={{textTransform: 'none'}}>Done</Button>
                    </Dialog>
        </Grid2>
        <Grid2 item>
          <Button variant="outlined" color="default">
            Make Calendar Public
          </Button>
        </Grid2>

        {/* Arrows for Month Navigation */}
        <Grid2 item>
          <ArrowBackIos onClick={goToPreviousMonth} style={{ cursor: "pointer" }} />
          <ArrowForwardIos onClick={goToNextMonth} style={{ cursor: "pointer" }} />
        </Grid2>

        {/* Slider for showing only scheduled times */}
        <Grid2 item>
          <Typography>Show only scheduled times</Typography>
          <Switch checked={showOnlyScheduled} onChange={handleSliderChange} />
        </Grid2>
      </Grid2>

      {/* Calendar */}
      <Paper style={{ marginTop: "20px", padding: "20px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)} // Keep track of date when navigating inside the calendar
          style={{ height: 500 }}
          min={minTime}  // Set min time based on the first event when switch is on
          max={maxTime}  // Set max time based on the last event when switch is on
        />
      </Paper>
    </Container>
  );
};

export default CalendarPage;