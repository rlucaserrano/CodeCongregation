

import React, { useState } from "react";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Checkbox,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { ExpandLess, ExpandMore, Settings } from "@mui/icons-material";
import { Calendar as MiniCalendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../components/CalendarMenu.css"; // Ensure styling is applied for layout issues

const CalendarMenu = ({
  myCalendars = [],
  sharedCalendars = [],
  currentDate,
  setCurrentDate,
  drawerOpen,
  toggleDrawer,
  addCalendar,
  renameCalendar,
  deleteCalendar,
  shareCalendar,
  setCalendars, // To handle myCalendars updates
  setSharedCalendars, // To handle sharedCalendars updates
}) => {
  const [myCalendarsOpen, setMyCalendarsOpen] = useState(true);
  const [sharedCalendarsOpen, setSharedCalendarsOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);

  // Toggles visibility of "My Calendars" section
  const toggleMyCalendars = () => setMyCalendarsOpen(!myCalendarsOpen);

  // Toggles visibility of "Shared Calendars" section
  const toggleSharedCalendars = () =>
    setSharedCalendarsOpen(!sharedCalendarsOpen);

  // Handles opening the menu for a specific calendar
  const handleMenuOpen = (event, calendarId) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedCalendarId(calendarId);
  };

  // Handles closing the menu
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedCalendarId(null);
  };

  // Handles date changes in the Mini Calendar
  const handleMiniCalendarChange = (date) => setCurrentDate(date);

  // Handles creating a new calendar
  const handleCreateCalendar = () => {
    if (!newCalendarName.trim()) {
      alert("Calendar name cannot be empty.");
      return;
    }
    addCalendar(newCalendarName);
    setNewCalendarName("");
    setCreateDialogOpen(false);
  };

  // Handles sharing a calendar with another user
  const handleShareCalendar = (calendarId) => {
    const userToShareWith = prompt("Enter the User ID to share with:");
    const accessLevel = prompt(
      "Enter access level (READ, WRITE, MANAGE):",
      "READ"
    );
    if (userToShareWith && accessLevel) {
      shareCalendar(calendarId, userToShareWith, accessLevel);
      setSharedCalendars((prev) => [
        ...prev,
        { id: calendarId, name: "New Shared Calendar", accessLevel },
      ]);
    }
    handleMenuClose();
  };

  // Handles toggling calendar visibility
  const toggleCalendarVisibility = (calendarId) => {
    setCalendars((prevCalendars) =>
      prevCalendars.map((calendar) =>
        calendar.id === calendarId
          ? { ...calendar, isVisible: !calendar.isVisible }
          : calendar
      )
    );
  };

  return (
    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
      <Box className="drawer-content">
        {/* Mini Calendar */}
        <Box className="mini-calendar">
          <MiniCalendar
            value={currentDate}
            onChange={handleMiniCalendarChange}
            minDetail="month"
            next2Label={null}
            prev2Label={null}
          />
        </Box>

        {/* My Calendars Section */}
        <List>
          <ListItem button onClick={toggleMyCalendars}>
            <ListItemText primary="My Calendars" />
            {myCalendarsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={myCalendarsOpen} timeout="auto" unmountOnExit>
            {myCalendars.map((calendar) => (
              <ListItem key={calendar.id} button>
                <Checkbox
                  checked={calendar.isVisible}
                  onChange={() => toggleCalendarVisibility(calendar.id)}
                />
                <ListItemText primary={calendar.name} />
                <IconButton
                  onClick={(event) => handleMenuOpen(event, calendar.id)}
                >
                  <Settings />
                </IconButton>
              </ListItem>
            ))}
          </Collapse>

          {/* Shared Calendars Section */}
          <ListItem button onClick={toggleSharedCalendars}>
            <ListItemText primary="Shared Calendars" />
            {sharedCalendarsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={sharedCalendarsOpen} timeout="auto" unmountOnExit>
            {sharedCalendars.map((calendar) => (
              <ListItem key={calendar.id} button>
                <Checkbox
                  checked={calendar.isVisible}
                  disabled={calendar.accessLevel === "READ"} // Disable toggle for READ-only calendars
                />
                <ListItemText
                  primary={`${calendar.name} (${calendar.accessLevel})`}
                />
              </ListItem>
            ))}
          </Collapse>

          {/* Add New Calendar Button */}
          <ListItem>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => setCreateDialogOpen(true)}
            >
              + Add New Calendar
            </Button>
          </ListItem>
        </List>
      </Box>

      {/* Menu for Calendar Actions */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            const newName = prompt("Enter a new name for the calendar:");
            if (newName) renameCalendar(selectedCalendarId, newName);
            handleMenuClose();
          }}
          disabled={sharedCalendars.some(
            (cal) =>
              cal.id === selectedCalendarId && cal.accessLevel !== "MANAGE"
          )}
        >
          Rename
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (
              window.confirm("Are you sure you want to delete this calendar?")
            ) {
              deleteCalendar(selectedCalendarId);
              handleMenuClose();
            }
          }}
          disabled={sharedCalendars.some(
            (cal) =>
              cal.id === selectedCalendarId && cal.accessLevel !== "MANAGE"
          )}
        >
          Delete
        </MenuItem>
        <MenuItem
          onClick={() => handleShareCalendar(selectedCalendarId)}
          disabled={sharedCalendars.some(
            (cal) =>
              cal.id === selectedCalendarId && cal.accessLevel !== "MANAGE"
          )}
        >
          Share
        </MenuItem>
      </Menu>

      {/* Dialog for Creating a New Calendar */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      >
        <DialogTitle>Create New Calendar</DialogTitle>
        <DialogContent>
          <TextField
            label="Calendar Name"
            fullWidth
            margin="normal"
            value={newCalendarName}
            onChange={(e) => setNewCalendarName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateCalendar}
            variant="contained"
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default CalendarMenu;
