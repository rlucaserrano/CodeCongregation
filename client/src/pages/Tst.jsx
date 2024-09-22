import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function Tst() {
  const [array, setArray] = useState([]);

  const fetchAPI = async () => {
    const response = await axios.get('http://localhost:8080/api/dev2');
    console.log(response.data.dev2);
    setArray(response.data.dev2);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <div>
      <p>
        Testing fetching and displaying data from an API specifically:
        <ol>
          <li>Connecting to "http://localhost:8080/api/dev2"</li>
          <li>Fetching an array of data</li>
          <li>Displaying each item on the page</li>
        </ol>
      </p>
      {array.map((dev2, index) => (
        <div key={index}>
          <span>{dev2}</span>
          <br />
        </div>
      ))}
    </div>
  );
}

export default Tst;
