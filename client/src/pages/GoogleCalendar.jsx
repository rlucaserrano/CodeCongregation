import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { 
    Button, Typography, Container, Paper, Dialog, DialogTitle, 
    DialogContent, DialogActions, TextField, Select, MenuItem, 
    FormControl, InputLabel, FormControlLabel, Checkbox, 
    IconButton, Box, Stack, Radio, RadioGroup, Drawer
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import "../components/Calendar.css";

const localizer = momentLocalizer(moment);
const CODER_CONGREGATION_CALENDAR_ID = '61c1fffe9aa039ccc410be4ed645c73ae5f13413dcfb560130c0e96b4a4a0a17@group.calendar.google.com';

const GoogleCalendar = () => {
    const [openNewCalendarDialog, setOpenNewCalendarDialog] = useState(false);
    const [newCalendarName, setNewCalendarName] = useState('');
    const [events, setEvents] = useState([]);
    const [calendarList, setCalendarList] = useState([]);
    const [selectedCalendars, setSelectedCalendars] = useState({});
    const [currentDate, setCurrentDate] = useState(new Date());
    const [error, setError] = useState(null);
    const [showOnlyScheduled, setShowOnlyScheduled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [newEvent, setNewEvent] = useState({
        type: 'event', // event or task
        title: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        location: '',
        guests: '',
        calendar: CODER_CONGREGATION_CALENDAR_ID,
        meetingLinkType: 'none',
        meetingLink: '',
    });

    useEffect(() => {
        const initializeGapiClient = async () => {
            try {
                await gapi.load('client', async () => {
                    await gapi.client.init({
                        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
                        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                    });
                    loadCalendarList();
                });
            } catch (error) {
                console.error("Failed to initialize GAPI client:", error);
                setError("Failed to initialize GAPI client");
            }
        };

        initializeGapiClient();
    }, []);

    const loadCalendarList = async () => {
        try {
            const calendars = [
                {
                    id: CODER_CONGREGATION_CALENDAR_ID,
                    summary: "CoderCongregation",
                },
            ];
            
            const calendarSelection = { [CODER_CONGREGATION_CALENDAR_ID]: true };
            setCalendarList(calendars);
            setSelectedCalendars(calendarSelection);
            fetchEvents(calendarSelection); 
        } catch (err) {
            setError("Failed to load calendar list");
        }
    };

    const fetchEvents = async (calendarSelection) => {
        try {
            const allEvents = [];
            calendarSelection[CODER_CONGREGATION_CALENDAR_ID] = true;

            for (const calendarId of Object.keys(calendarSelection)) {
                if (calendarSelection[calendarId]) {
                    const response = await gapi.client.calendar.events.list({
                        calendarId: calendarId,
                        timeMin: new Date().toISOString(),
                        showDeleted: false,
                        singleEvents: true,
                        maxResults: 50,
                        orderBy: 'startTime',
                    });
                    allEvents.push(...response.result.items.map(event => ({
                        title: event.summary,
                        start: new Date(event.start.dateTime || event.start.date),
                        end: new Date(event.end.dateTime || event.end.date),
                        id: event.id,
                    })));
                }
            }

            setEvents(allEvents);
        } catch (err) {
            setError('Failed to fetch events');
        }
    };

    const goToPreviousMonth = () => setCurrentDate(moment(currentDate).subtract(1, "months").toDate());
    const goToNextMonth = () => setCurrentDate(moment(currentDate).add(1, "months").toDate());

    // Handle opening the Create Event dialog
    const handleCreateEventDialogOpen = () => setOpenCreateDialog(true);
    const handleCreateEventDialogClose = () => setOpenCreateDialog(false);

    // Update the new event data based on form input
    const handleEventInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent((prev) => ({ ...prev, [name]: value }));
    };

    // Submit the new event to the Google Calendar API
    const handleCreateEvent = async () => {
        const event = {
            summary: newEvent.title,
            location: newEvent.location,
            start: {
                dateTime: `${newEvent.startDate}T${newEvent.startTime}`,
                timeZone: 'America/New_York',
            },
            end: {
                dateTime: `${newEvent.endDate}T${newEvent.endTime}`,
                timeZone: 'America/New_York',
            },
            attendees: newEvent.guests.split(',').map((email) => ({ email: email.trim() })),
            conferenceData: newEvent.meetingLinkType === 'google_meet' ? {
                createRequest: { requestId: Math.random().toString(36).substr(2, 10) }
            } : undefined,
        };

        try {
            await gapi.client.calendar.events.insert({
                calendarId: newEvent.calendar,
                resource: event,
                conferenceDataVersion: newEvent.meetingLinkType === 'google_meet' ? 1 : 0,
            });
            setOpenCreateDialog(false);
            fetchEvents(selectedCalendars);
        } catch (err) {
            setError('Failed to create event');
        }
    };

    return (
        <Container className="calendar-container">
            <Typography variant="h4" className="calendar-title">Google Calendar</Typography>
            {error && <p className="error-message">{error}</p>}

            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" className="calendar-controls">
                <Button variant="contained" color="primary" onClick={handleCreateEventDialogOpen}>
                    Create
                </Button>

                <IconButton onClick={() => setDrawerOpen(true)}><MenuIcon /></IconButton>
            </Stack>

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
                />
            </Paper>
             {/* Create Event Dialog */}
             <Dialog open={openCreateDialog} onClose={handleCreateEventDialogClose}>
                <DialogTitle>Create a New {newEvent.type === 'task' ? 'Task' : 'Event'}</DialogTitle>
                <DialogContent>
                    {/* Event or Task Selection */}
                    <RadioGroup
                        row
                        name="type"
                        value={newEvent.type}
                        onChange={handleEventInputChange}
                    >
                        <FormControlLabel value="event" control={<Radio />} label="Event" />
                        <FormControlLabel value="task" control={<Radio />} label="Task" />
                    </RadioGroup>

                    {/* Title */}
                    <TextField
                        label="Title"
                        name="title"
                        fullWidth
                        margin="normal"
                        value={newEvent.title}
                        onChange={handleEventInputChange}
                    />

                    {/* Start Date and Time */}
                    <TextField
                        label="Start Date"
                        type="date"
                        name="startDate"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={newEvent.startDate}
                        onChange={handleEventInputChange}
                    />
                    <TextField
                        label="Start Time"
                        type="time"
                        name="startTime"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={newEvent.startTime}
                        onChange={handleEventInputChange}
                    />

                    {/* End Date and Time */}
                    <TextField
                        label="End Date"
                        type="date"
                        name="endDate"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={newEvent.endDate}
                        onChange={handleEventInputChange}
                    />
                    <TextField
                        label="End Time"
                        type="time"
                        name="endTime"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={newEvent.endTime}
                        onChange={handleEventInputChange}
                    />

                    {/* Location */}
                    <TextField
                        label="Location"
                        name="location"
                        fullWidth
                        margin="normal"
                        value={newEvent.location}
                        onChange={handleEventInputChange}
                    />

                    {/* Guests */}
                    <TextField
                        label="Guests (comma-separated emails)"
                        name="guests"
                        fullWidth
                        margin="normal"
                        value={newEvent.guests}
                        onChange={handleEventInputChange}
                    />

                    {/* Calendar Selection */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Calendar</InputLabel>
                        <Select
                            name="calendar"
                            value={newEvent.calendar}
                            onChange={handleEventInputChange}
                        >
                            {calendarList.map((calendar) => (
                                <MenuItem key={calendar.id} value={calendar.id}>
                                    {calendar.summary}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Meeting Link Configuration */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Meeting Link Type</InputLabel>
                        <Select
                            name="meetingLinkType"
                            value={newEvent.meetingLinkType}
                            onChange={handleEventInputChange}
                        >
                            <MenuItem value="none">None</MenuItem>
                            <MenuItem value="google_meet">Google Meet</MenuItem>
                            <MenuItem value="zoom">Zoom</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Meeting Link (if Zoom selected) */}
                    {newEvent.meetingLinkType === 'zoom' && (
                        <TextField
                            label="Zoom Meeting Link"
                            name="meetingLink"
                            fullWidth
                            margin="normal"
                            value={newEvent.meetingLink}
                            onChange={handleEventInputChange}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCreateEventDialogClose} color="secondary">Cancel</Button>
                    <Button onClick={handleCreateEvent} color="primary" variant="contained">Create</Button>
                </DialogActions>
            </Dialog>
            {/*New Calendar Dialogue*/}
            <Dialog open={openNewCalendarDialog} onClose={() => setOpenNewCalendarDialog(false)}>
    <DialogTitle>Create a New Calendar</DialogTitle>
    <DialogContent>
        <TextField
            id="newCalendarName"
            label="Calendar Name"
            value={newCalendarName}
            onChange={(e) => setNewCalendarName(e.target.value)}
            fullWidth
        />
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setOpenNewCalendarDialog(false)} color="primary">
            Cancel
        </Button>
        <Button
            onClick={async () => {
                try {
                    await gapi.client.calendar.calendars.insert({
                        resource: { summary: newCalendarName },
                    });
                    setOpenNewCalendarDialog(false);
                    setNewCalendarName('');
                    loadCalendarList(); // Refresh calendar list to show the new calendar
                } catch (error) {
                    console.error('Failed to create calendar:', error);
                }
            }}
            color="primary"
            variant="contained"
        >
            Create
        </Button>
    </DialogActions>
</Dialog>

            {/* Drawer for Calendar Selection */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <Box p={2} width="250px">
                    <Typography variant="h6">Calendars</Typography>
                    {calendarList.map((calendar) => (
                        <FormControlLabel
                            key={calendar.id}
                            control={
                                <Checkbox
                                    checked={selectedCalendars[calendar.id] || false}
                                    onChange={() => toggleCalendarVisibility(calendar.id)}
                                    color="primary"
                                />
                            }
                            label={calendar.summary}
                        />
                    ))}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setOpenNewCalendarDialog(true)}
                        style={{ marginTop: '10px' }}
                    >
                        Create New Calendar
                    </Button>
                </Box>
            </Drawer>
        </Container>
    );
};

export default GoogleCalendar;
