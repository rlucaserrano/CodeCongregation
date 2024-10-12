import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from "react-router-dom";



function Chapters() {
  async function handleResGet()
    {
        await fetch('http://localhost:8080/res', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: 'GET'
        })
        .then(function(res){console.log(res)})
        .catch(function(res){console.log(res)})
        console.log("Here")
    }
  return (
    <html>
      <header onLoad={handleResGet()}>
        <h1>Tutorials</h1>
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
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Icon</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align='right'>Link</TableCell>
                  <TableCell align='right'>Votes</TableCell>
                </TableRow>
              </TableHead>
            </Table>
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