import React, { useState, useEffect, useContext } from "react";
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
  Select,
  MenuItem as DropdownItem,
} from "@mui/material";
import { ExpandLess, ExpandMore, Settings } from "@mui/icons-material";
import { Calendar as MiniCalendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../components/CalendarMenu.css"; // Ensure styling is applied for layout issues
import { classifyCalendars } from "../components/calendarUtils";
import { UserContext } from "../context/UserContext"; // Import UserContext for userId
import { getPermissions } from "../components/CalAccessLevel";
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
  const { user } = useContext(UserContext); // Get user from UserContext
  const userId = user?.userId; // Retrieve userId from user

  const [myCalendarsOpen, setMyCalendarsOpen] = useState(true);
  const [sharedCalendarsOpen, setSharedCalendarsOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);
  const [usernameToShare, setUsernameToShare] = useState("");
  const [accessLevel, setAccessLevel] = useState("MANAGE");


  const toggleMyCalendars = () => setMyCalendarsOpen(!myCalendarsOpen);


  const toggleSharedCalendars = () =>
    setSharedCalendarsOpen(!sharedCalendarsOpen);


  const handleMenuOpen = (event, calendarId) => {
    const calendar = [...myCalendars, ...sharedCalendars].find(
      (cal) => cal.id === calendarId
    );
    const permissions = getPermissions(calendar?.accessLevel);
  
    if (!permissions.canShareCalendar) {
      alert("You do not have permission to share this calendar.");
      return;
    }
    setMenuAnchorEl(event.currentTarget);
    setSelectedCalendarId(calendarId);
  };

  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    //setSelectedCalendarId(null);
  };

 
  const handleMiniCalendarChange = (date) => setCurrentDate(date);

 
  const handleCreateCalendar = () => {
    if (!newCalendarName.trim()) {
      alert("Calendar name cannot be empty.");
      return;
    }
    addCalendar(newCalendarName);
    setNewCalendarName("");
    setCreateDialogOpen(false);
  };
  const fetchCalendars = async (userId) => {
    if (!userId) {
      console.error("User ID is required to fetch calendars.");
      throw new Error("User ID is missing.");
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:8080/calendar?userId=${userId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.ERROR || "Failed to fetch calendars.");
      }
      const calendarData = await response.json();
  
      // Log all calendars fetched from the API
     
  
      // Deduplicate calendars based on their ID
      const uniqueCalendars = calendarData.calendars.filter(
        (calendar, index, self) =>
          index === self.findIndex((cal) => cal.id === calendar.id)
      );
  
     
     
  
      return uniqueCalendars;
    } catch (error) {
      console.error("Error fetching calendars:", error);
      throw error; 
    }
  };
  

  const handleShareCalendar = async () => {
    
  
    if (!selectedCalendarId) {
      console.error("[ERROR] Calendar ID is missing");
      alert("Calendar ID is missing. Please try again.");
      return;
    }
  
    if (!usernameToShare.trim()) {
      console.error("[ERROR] Username is required");
      alert("Username is required.");
      return;
    }
  
    try {
      const payload = {
        calendarId: selectedCalendarId, 
        username: usernameToShare,
        accessLevel,
      };
  
    
  
      const response = await fetch("http://127.0.0.1:8080/calendar/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error("[ERROR] Backend returned error:", error);
        throw new Error(error.ERROR || "Failed to share calendar.");
      }
  
      const success = await response.json();
  
      alert("Calendar shared successfully!");
      setShareDialogOpen(false);
      setUsernameToShare("");
      setAccessLevel("MANAGE");
    } catch (error) {
      console.error("[ERROR] Error sharing calendar:", error.message);
      alert(error.message);
    }
  };
  

  useEffect(() => {
    
    const loadCalendars = async () => {
      try {
        if (!userId) {
          console.error("User ID is required to load calendars.");
          return;
        }

        const fetchedCalendars = await fetchCalendars(userId);

        const uniqueMyCalendars = fetchedCalendars.filter(
          (cal) => cal.accessLevel === "OWNER" || cal.accessLevel === "MANAGE"
        );
        const uniqueSharedCalendars = fetchedCalendars.filter(
          (cal) => cal.accessLevel !== "OWNER" && cal.accessLevel !== "MANAGE"
        );
        

        setCalendars(uniqueMyCalendars);
        setSharedCalendars(uniqueSharedCalendars);
      } catch (error) {
        console.error("Error loading calendars:", error.message);
      }
    };

    loadCalendars();
  }, [userId]); 

  useEffect(() => {
    if (selectedCalendarId !== null) {
    
    }
  }, [selectedCalendarId]);

  useEffect(() => {
  
  }, [sharedCalendars]);
  

  
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
      
          <ListItem button={true.toString()} onClick={toggleMyCalendars}>
           <ListItemText primary="My Calendars" />
           {sharedCalendarsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={myCalendarsOpen} timeout="auto" unmountOnExit>
            {myCalendars.map((calendar, index) => (
              <ListItem key={calendar.id || `my-calendar-${index}`} button>
                <Checkbox
                  checked={calendar.isVisible}
                  onChange={() =>
                    setCalendars((prev) =>
                      prev.map((cal) =>
                        cal.id === calendar.id
                          ? { ...cal, isVisible: !cal.isVisible }
                          : cal
                      )
                    )
                  }
                />
                <ListItemText primary={calendar.name} />
                <IconButton onClick={(event) =>{
                 
                  handleMenuOpen(event, calendar.id)}}>
                  <Settings />
                </IconButton>
              </ListItem>
            ))}
          </Collapse>

          <List>
        {/* Toggle Button for Shared Calendars */}
        <ListItem button={true.toString()} onClick={toggleSharedCalendars}>
  <ListItemText primary="Shared Calendars" />
  {sharedCalendarsOpen ? <ExpandLess /> : <ExpandMore />}
</ListItem>


    {/* Shared Calendars */}
    <Collapse
  in={sharedCalendarsOpen}
  timeout="auto"
  unmountOnExit
  style={{ display: sharedCalendars.length > 0 ? "block" : "none" }}
>
  {sharedCalendars.map((calendar, index) => (
    <ListItem key={calendar.id || `shared-calendar-${index}`} button>
      <Checkbox
        checked={calendar.isVisible}
        onChange={() =>
          setSharedCalendars((prev) =>
            prev.map((cal) =>
              cal.id === calendar.id
                ? { ...cal, isVisible: !cal.isVisible }
                : cal
            )
          )
        }
      />
      <ListItemText primary={calendar.name} /> {/* Only the name is displayed */}
    </ListItem>
  ))}
</Collapse>

  </List>

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
            const calendar = [...myCalendars, ...sharedCalendars].find(
              (cal) => cal.id === selectedCalendarId
            );

            const { accessLevel } = calendar || {};
            const permissions = getPermissions(accessLevel);

            if (!permissions.canShareCalendar) {
              alert("You do not have permission to share this calendar.");
              return;
            }

            setShareDialogOpen(true);
            handleMenuClose();
          }}
        >
          Share
        </MenuItem>
        <MenuItem
          onClick={() => {
            const calendar = [...myCalendars, ...sharedCalendars].find(
              (cal) => cal.id === selectedCalendarId
            );

            const { accessLevel } = calendar || {};
            const permissions = getPermissions(accessLevel);

            if (!permissions.canDeleteCalendar) {
              alert("You do not have permission to delete this calendar.");
              return;
            }

            if (window.confirm("Are you sure you want to delete this calendar?")) {
              deleteCalendar(selectedCalendarId);
              handleMenuClose();
            }
          }}
        >
          Delete
        </MenuItem>
        </Menu>
      {/* Dialog for Sharing a Calendar */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
        <DialogTitle>Share Calendar</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            fullWidth
            value={usernameToShare}
            onChange={(e) => setUsernameToShare(e.target.value)}
            margin="normal"
          />
          <Select
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value)}
            fullWidth
          >
            <DropdownItem value="MANAGE">Access to Manage</DropdownItem>
            <DropdownItem value="WRITE">Access to Edit</DropdownItem>
            <DropdownItem value="READ">Access to View</DropdownItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleShareCalendar} color="primary">
            Share
          </Button>
        </DialogActions>
      </Dialog>

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
