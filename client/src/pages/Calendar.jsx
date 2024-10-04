import React, { useEffect, useState } from 'react';

function Calendar() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem('google_access_token');
            if (!token) {
                setError('Google token not found. Please login again.');
                setLoading(false);
                return;
            }

            const response = await fetch(`http://localhost:8080/api/calendar/events?token=${token}`);
            if (!response.ok) {
                throw new Error('Failed to fetch events from Google Calendar');
            }

            const data = await response.json();
            setEvents(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Error fetching events. Please try again.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div>
            <h2>Calendar Page</h2>
            {loading ? (
                <p>Loading events...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <ul>
                    {events.length > 0 ? (
                        events.map(event => (
                            <li key={event.id}>
                                <strong>{event.summary}</strong> <br />
                                Start: {event.start.dateTime || event.start.date} <br />
                                End: {event.end.dateTime || event.end.date}
                            </li>
                        ))
                    ) : (
                        <p>No events found.</p>
                    )}
                </ul>
            )}
        </div>
    );
}

export default Calendar;
