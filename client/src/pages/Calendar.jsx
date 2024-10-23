import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Container, Paper, Typography, Button, Switch, Grid } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import TextField from '@mui/material/TextField';
import "../components/Calendar.css";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showOnlyScheduled, setShowOnlyScheduled] = useState(false);
    const [openT, setOpenT] = useState(false);
    const [openN, setOpenN] = useState(false);

    const events = [
        { start: new Date(), end: new Date(moment().add(1, "hours")), title: "Sample Event" },
        { start: new Date(moment().add(1, "days")), end: new Date(moment().add(1, "days").add(1, "hours")), title: "Another Event" }
    ];

    const goToPreviousMonth = () => {
        setCurrentDate(moment(currentDate).subtract(1, "months").toDate());
    };

    const goToNextMonth = () => {
        setCurrentDate(moment(currentDate).add(1, "months").toDate());
    };

    const integrateWithGoogleCalendar = () => {
        window.open("https://calendar.google.com", "_blank");
    };

    const handleSliderChange = () => {
        setShowOnlyScheduled(!showOnlyScheduled);
    };

    const getMinAndMaxTimes = (events) => {
        if (events.length === 0) return { minTime: new Date(0, 0, 0, 0, 0), maxTime: new Date(0, 0, 0, 23, 59) };

        const times = events.flatMap(event => [event.start, event.end]);
        const minTime = new Date(Math.min(...times.map(time => time.getTime())));
        const maxTime = new Date(Math.max(...times.map(time => time.getTime())));

        return { minTime, maxTime };
    };

    const { minTime, maxTime } = showOnlyScheduled ? getMinAndMaxTimes(events) : { minTime: new Date(0, 0, 0, 0, 0), maxTime: new Date(0, 0, 0, 23, 59) };

    return (
        <Container className="calendar-container">
            <Typography variant="h4" className="calendar-title">Calendar</Typography>
            <Grid container spacing={2} alignItems="center" justifyContent="space-between" className="calendar-controls">
                <Grid item>
                    <Button variant="contained" onClick={integrateWithGoogleCalendar}>
                        Integrate with Google Calendar
                    </Button>
                </Grid>
                <Grid item>
                    <Button onClick={() => setOpenT(true)} variant="contained" color="secondary">Add Task</Button>
                    <Dialog open={openT} onClose={() => setOpenT(false)}>
                        <DialogTitle>Add a new task:</DialogTitle>
                        <TextField id="TaskTime" type="datetime-local" defaultValue="" fullWidth />
                        <TextField id="TaskDesc" label="Task Description" fullWidth />
                        <Button variant='contained' onClick={() => setOpenT(false)}>Done</Button>
                    </Dialog>
                </Grid>
                <Grid item>
                    <Button onClick={() => setOpenN(true)} variant="contained" color="secondary">Add New Calendar</Button>
                    <Dialog open={openN} onClose={() => setOpenN(false)}>
                        <DialogTitle>Create a new calendar:</DialogTitle>
                        <TextField id="CalName" label="Calendar Name" fullWidth />
                        <Button variant='contained' onClick={() => setOpenN(false)}>Done</Button>
                    </Dialog>
                </Grid>
                <Grid item>
                    <Button variant="outlined" color="default">Make Calendar Public</Button>
                </Grid>
                <Grid item>
                    <ArrowBackIos onClick={goToPreviousMonth} className="calendar-arrow" />
                    <ArrowForwardIos onClick={goToNextMonth} className="calendar-arrow" />
                </Grid>
                <Grid item>
                    <Typography>Show only scheduled times</Typography>
                    <Switch checked={showOnlyScheduled} onChange={handleSliderChange} />
                </Grid>
            </Grid>

            <Paper className="calendar-paper">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView="month"
                    date={currentDate}
                    onNavigate={(date) => setCurrentDate(date)}
                    style={{ height: 500 }}
                    min={minTime}
                    max={maxTime}
                />
            </Paper>
        </Container>
    );
};

export default CalendarPage;
