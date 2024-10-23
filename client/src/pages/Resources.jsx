import React from 'react';
import { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import BuildIcon from '@mui/icons-material/Build'; //Practice Questions
import SchoolIcon from '@mui/icons-material/School'; //Tutorials
import VisibilityIcon from '@mui/icons-material/Visibility'; //Visualization Materials
import BookIcon from '@mui/icons-material/Book'; //Computer Science Theory
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary'; //Misc/Other

function Resources() {

  const [safe, setSafe] = useState(false)

  const [res, setRes] = useState()

  async function handleResGet()
  {
    let data = await fetch('http://localhost:8080/res', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        method: 'GET'
    })
    setRes(await data.json());
    setSafe(true)  
  }

  useEffect(() => {
    handleResGet()
  }, [])

  function handleImage(e)
  {
    if (e == 'Practice Questions')
    {
      return <BuildIcon/>;
    }
    else if (e == 'Tutorials')
    {
      return <SchoolIcon/>;
    }
    else if (e == 'Visualization Materials')
    {
      return <VisibilityIcon/>;
    }
    else if (e == 'Computer Science Theory')
    {
      return <BookIcon/>;
    }
    return <LocalLibraryIcon/>;
  }
  
  if (safe == true)
  {
    return (
      <html>
        <header>
          <h1>Resources (TBD)</h1>
          <p>Here you will find frequently shared resources. Websites and other materials for you and your friends to study and practice with.</p>
          <h2>Legend:</h2>
          <Table style={{display: 'flex', flexDirection: 'column', height: 20}}>
            <p><SchoolIcon/>Tutorials</p>
            <p><BuildIcon/> Practice Questions</p>
            <p><VisibilityIcon/> Visualizations</p>
            <p><BookIcon/> Computer Science Theory</p>
            <p><LocalLibraryIcon/> Other</p>
          </Table>
        <h3>Currently displaying resources for: *Group Name*</h3>
        <p>Select a type of educational resource to study:</p>
        </header>
      <div>
          <Accordion sx={{width: '100%'}}>
            <AccordionSummary expandIcon={'v'}>
            Tutorials
            </AccordionSummary>
            <AccordionDetails>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Resource Icon</TableCell>
                    <TableCell>Resource Name</TableCell>
                    <TableCell align='right'>Resource Link</TableCell>
                    <TableCell align='right'>Votes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{handleImage(res[4][2])}</TableCell>
                    <TableCell>{res[4][0]}</TableCell>
                    <TableCell align='right'><a href={res[4][1]} target='_blank'>{res[4][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[4][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{handleImage(res[5][2])}</TableCell>
                    <TableCell>{res[5][0]}</TableCell>
                    <TableCell align='right'><a href={res[5][1]} target='_blank'>{res[5][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[5][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{handleImage(res[6][2])}</TableCell>
                    <TableCell>{res[6][0]}</TableCell>
                    <TableCell align='right'><a href={res[6][1]} target='_blank'>{res[6][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[6][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{width: '100%'}}>
            <AccordionSummary expandIcon={'v'}>
            Practice Questions
            </AccordionSummary>
            <AccordionDetails>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Resource Icon</TableCell>
                    <TableCell>Resource Name</TableCell>
                    <TableCell align='right'>Resource Link</TableCell>
                    <TableCell align='right'>Votes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{res[0][2]}</TableCell>
                    <TableCell>{res[0][0]}</TableCell>
                    <TableCell align='right'><a href={res[0][1]} target='_blank'>{res[0][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[0][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{res[1][2]}</TableCell>
                    <TableCell>{res[1][0]}</TableCell>
                    <TableCell align='right'><a href={res[1][1]} target='_blank'>{res[1][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[1][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{res[2][2]}</TableCell>
                    <TableCell>{res[2][0]}</TableCell>
                    <TableCell align='right'><a href={res[2][1]} target='_blank'>{res[2][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[2][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{res[3][2]}</TableCell>
                    <TableCell>{res[3][0]}</TableCell>
                    <TableCell align='right'><a href={res[3][1]} target='_blank'>{res[3][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[3][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{width: '100%'}}>
            <AccordionSummary expandIcon={'v'}>
            Visualizations
            </AccordionSummary>
            <AccordionDetails>
            <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Resource Icon</TableCell>
                    <TableCell>Resource Name</TableCell>
                    <TableCell align='right'>Resource Link</TableCell>
                    <TableCell align='right'>Votes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{res[7][2]}</TableCell>
                    <TableCell>{res[7][0]}</TableCell>
                    <TableCell align='right'><a href={res[7][1]} target='_blank'>{res[7][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[7][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{res[8][2]}</TableCell>
                    <TableCell>{res[8][0]}</TableCell>
                    <TableCell align='right'><a href={res[8][1]} target='_blank'>{res[8][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[8][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{width: '100%'}}>
            <AccordionSummary expandIcon={'v'}>
            Computer Science Theory
            </AccordionSummary>
            <AccordionDetails>
            <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Resource Icon</TableCell>
                    <TableCell>Resource Name</TableCell>
                    <TableCell align='right'>Resource Link</TableCell>
                    <TableCell align='right'>Votes</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{res[9][2]}</TableCell>
                    <TableCell>{res[9][0]}</TableCell>
                    <TableCell align='right'><a href={res[9][1]} target='_blank'>{res[9][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[9][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{res[10][2]}</TableCell>
                    <TableCell>{res[10][0]}</TableCell>
                    <TableCell align='right'><a href={res[10][1]} target='_blank'>{res[10][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[10][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{width: '100%'}}>
            <AccordionSummary expandIcon={'v'}>
            Add your own resources
            </AccordionSummary>
            <AccordionDetails>
              <p>Save the resources you want to study here: <Button variant='outlined' sx={{minWidth:25, width:25, minHeight:25, height:25}}>+</Button></p>
            </AccordionDetails>
          </Accordion>
      </div>
      </html>
    ); 
  }
}

export default Resources;