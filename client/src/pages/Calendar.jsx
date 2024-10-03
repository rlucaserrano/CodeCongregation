import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
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

    return (
        <html>
            <div>
                <h2>Calendar Page</h2>
                <ul>
                    {/*events.map(event => (
                        <li key={event.id}>{event.summary}</li>
                    ))*/}
                </ul>
                <div>
                    <Button>Use Google Calendar</Button>
                    <Button color='warning'>Make Calendar Public</Button>
                    <Button sx={{color:'#000'}}>Add Task +</Button>
                    <Button sx={{color:'#000'}}>Add New Calendar +</Button>
                </div>
            </div>
            <table>
                <Calendar localizer={localizer} events={events} startAccessor="start" endAccessor="end" style={{height: 1000, width: 2000}}/>
            </table>
        </html>
    );
}

export default Cal;
