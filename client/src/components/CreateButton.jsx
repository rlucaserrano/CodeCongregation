import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem as SelectItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import './CreateButton.css';

const CreateButton = ({ calendars, onEventSubmit }) => {
    const [eventData, setEventData] = useState({
      title: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      calendarId: '',
      description: '',
    });
    const [anchorEl, setAnchorEl] = useState(null);
    const [openEventDialog, setOpenEventDialog] = useState(false);
    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    //event Dialog Handlers
    const openEvent = () => {
        handleMenuClose();
        setOpenEventDialog(true);
    };
    const closeEvent = () => setOpenEventDialog(false);
  
    const handleEventSubmit = async () => {
  const { title, startDate, startTime, endDate, endTime, calendarId, description } = eventData;

  if (!title || !startDate || !startTime || !endDate || !endTime || !calendarId) {
    alert('All required fields must be filled out!');
    return;
  }

  // prep payload
  const payload = {
    valCalendarID: String(calendarId),
    valEventName: String(title),
    valEventDescription: String(description) || '',
    valStartDate: String(startDate),
    valEndDate: String(endDate),
    valStartTime: String(startTime),
    valEndTime: String(endTime),
    valStatus: String(1),
    valFromGoogle: String(0),
  };

  console.log('Payload sent to backend:', payload); // debugging

  try {
    const response = await fetch('http://localhost:8080/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const savedEvent = await response.json();
      onEventSubmit({
        ...savedEvent,
        title, // event details for frontend use
        startDate,
        startTime,
        endDate,
        endTime,
        calendarId,
        description,
      });
      alert(`Event created successfully with ID: ${savedEvent.eventID}`);
    } else {
      const error = await response.json();
      console.error('Error from backend:', error);
      alert(`Failed to create event: ${error.ERROR || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error creating event:', error);
    alert('Error connecting to the server');
  }

  // reset form and close dialog
  setEventData({
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    calendarId: '',
    description: '',
  });
  setOpenEventDialog(false);
};

  return (
    <div>
      {/* Create Button */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        className="create-button"
        onClick={handleMenuClick}
      >
        Create
      </Button>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className="dropdown-menu"
      >
        <MenuItem onClick={openEvent} className="dropdown-item">
          Event
        </MenuItem>
      </Menu>

      {/* Event Dialog */}
      <Dialog open={openEventDialog} onClose={closeEvent} className="dialog">
        <DialogTitle>Create Event</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={eventData.title}
            onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
            variant="outlined"
          />
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            margin="normal"
            value={eventData.startDate}
            onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Start Time"
            type="time"
            fullWidth
            margin="normal"
            value={eventData.startTime}
            onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            margin="normal"
            value={eventData.endDate}
            onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Time"
            type="time"
            fullWidth
            margin="normal"
            value={eventData.endTime}
            onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Calendar</InputLabel>
            <Select
              value={eventData.calendarId}
              onChange={(e) => setEventData({ ...eventData, calendarId: e.target.value })}
            >
              {calendars.map((calendar) => (
                <SelectItem key={calendar.id} value={calendar.id}>
                  {calendar.name}
                </SelectItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={eventData.description}
            onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEvent}>Cancel</Button>
          <Button onClick={handleEventSubmit} variant="contained">
            Create Event
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateButton;
