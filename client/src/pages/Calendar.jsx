import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import moment from 'moment'
import '../assets/arrange.css';

function Cal() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Fetch events from the server
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem('google_token'); // Retrieve the token stored during login
                if (!token) {
                    console.error('Google token not found');
                    return;
                }
                const response = await fetch(`http://localhost:8080/api/calendar/events?token=${token}`);
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    const localizer = momentLocalizer(moment)

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

    return (
        <html>
            <div>
                <h1>Calendar</h1>
                <ul>
                    {/*events.map(event => (
                        <li key={event.id}>{event.summary}</li>
                    ))*/ /*Google Calendar was temporarily commented out while working on the regular calendar*/}
                </ul>
                <div>
                    <Button>Use Google Calendar</Button>
                    <Button color='warning'>Make Calendar Public</Button>
                    <Button sx={{color:'#000'}} onClick={handleClickOpenT}>Add Task +</Button>
                    <Dialog open={openT} onClose={handleCloseT}>
                        <DialogTitle>Add a new task:</DialogTitle>
                        <TextField id="TaskTime" type="datetime-local" defaultValue = ""/>
                        <TextField id="TaskDesc" label="Input task" defaultValue = ""/>
                        <Button variant='contained' onClick={handleCloseT} style={{textTransform: 'none'}}>Done</Button>
                    </Dialog>
                    <Button sx={{color:'#000'}} onClick={handleClickOpenN}>Add New Calendar +</Button>
                    <Dialog open={openN} onClose={handleCloseN}>
                        <DialogTitle>Create a new calendar:</DialogTitle>
                        <TextField id="CalName" label="Input Calendar Name:" defaultValue = ""/>
                        <Button variant='contained' onClick={handleCloseN} style={{textTransform: 'none'}}>Done</Button>
                    </Dialog>
                </div>
            </div>
            <div>
                <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" views={['month', 'day', 'agenda']}/>
            </div>
        </html>
    );
}

export default Cal;
