import React, { useEffect, useState } from 'react';

function Calendar() {
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

    return (
        <div>
            <h2>Calendar Page</h2>
            <ul>
                {events.map(event => (
                    <li key={event.id}>{event.summary}</li>
                ))}
            </ul>
        </div>
    );
}

export default Calendar;
