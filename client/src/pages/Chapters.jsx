import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { Link } from "react-router-dom";

function Chapters() {
  return (
    <html>
      <header>
        <h1>Chapters Page</h1>
      <p>Select a Chapter and a Lesson:</p>
      </header>
    <div>
        <Accordion sx={{width: '100%'}}>
          <AccordionSummary expandIcon={'v'}>
          Chapter 1
          </AccordionSummary>
          <AccordionDetails>
            <p>Temporary Example:</p>
              <div>
                  Python and C Project: <Link to ={'https://www.geeksforgeeks.org/number-guessing-game-in-python/'}>
                  Number guessing game in Python 3 and C
                  </Link>
              </div>
              <div>
                  Python Guessing Game: <Link to ={'https://www.geeksforgeeks.org/python-program-for-word-guessing-game/'}>
                  Word guessing Game in Python
                  </Link>
              </div>
              <div>
                  Python Hangman: <Link to ={'https://www.geeksforgeeks.org/hangman-game-python/'}>
                  Hangman game in Python
                  </Link>
              </div>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{width: '100%'}}>
          <AccordionSummary expandIcon={'v'}>
          Chapter 2
          </AccordionSummary>
          <AccordionDetails>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{width: '100%'}}>
          <AccordionSummary expandIcon={'v'}>
          Chapter 3
          </AccordionSummary>
          <AccordionDetails>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{width: '100%'}}>
          <AccordionSummary expandIcon={'v'}>
          Chapter 4
          </AccordionSummary>
          <AccordionDetails>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{width: '100%'}}>
          <AccordionSummary expandIcon={'v'}>
          Chapter 5
          </AccordionSummary>
          <AccordionDetails>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{width: '100%'}}>
          <AccordionSummary expandIcon={'v'}>
          Chapter 6
          </AccordionSummary>
          <AccordionDetails>
          </AccordionDetails>
        </Accordion>
    </div>
    </html>
  );
}

export default Chapters;