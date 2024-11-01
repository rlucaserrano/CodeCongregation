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
import { IconButton, TableBody } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { CheckBox } from '@mui/icons-material';

// Sources used to create Resources.jsx
// 1. https://mui.com/material-ui/
// 2. https://www.w3schools.com/js/js_loop_for.asp
// 3. https://www.robinwieruch.de/react-checkbox/
// 4. https://www.geeksforgeeks.org/how-to-declare-global-variables-in-javascript/
// 5. https://www.w3schools.com/js/js_set_methods.asp

// Global resources. Will need to be updated for proper guest display and study group navigation.
let guest = false;
let user = true;
let categories = ["Practice Questions", "Tutorials", "Visualization Tools", "Computer Science Theory", "Collaborative Tools", "Career Development"]
let groupID = "1";
let maskedCat = new Set();
let clickedRow = 0;

function useGroupResources(currGroupID) {

  const [safe, setSafe] = useState(false)
  const [res, setRes] = useState()

  async function handleResGet()
  {
    let data = await fetch('http://localhost:8080/groupresources', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({ 
          'valGroupID': currGroupID,
          'switch': 'GET'
        }),
        method: 'POST'
    })
    setRes(await data.json());
    setSafe(true)  
  }

  useEffect(() => {
    handleResGet();
  }, [maskedCat]);

  return [safe, res];
}
function useGroupResourceCategories(currGroupID) {

  const [safe, setSafe] = useState(false)
  const [res, setRes] = useState()

  async function handleResGet()
  {
    let data = await fetch('http://localhost:8080/groupresources', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({ 
          'valGroupID': currGroupID,
          'switch': 'GET',
          'Distinct': 'true',
          'colResourceCategory': 'true'
        }),
        method: 'POST'
    })
    setRes(await data.json());
    setSafe(true)  
  }

  useEffect(() => {
    handleResGet()
  }, [])

  return [safe, res];
}

function GenerateRows(data, updateRowClick){
  
  // Iterates through array to generate and return rows of the table.
  let returnedLine = [];
  for (let i = 0; i < data.length; i++) {
    if (!maskedCat.has(data[i][4])) {
      if (i == clickedRow) {
        returnedLine.push(
          <TableRow style={{backgroundColor: '#f7f7f8'}}>
            <TableCell style={{fontWeight: 'bold'}}>{data[i][2]}</TableCell>
            <TableCell ><a href={data[i][3]} target='_blank' style={{fontWeight: 'bold'}}>{data[i][3]}</a></TableCell>
            <TableCell></TableCell>
          </TableRow>
        );
      }
      else {
        returnedLine.push(
          <TableRow>
            <TableCell>{data[i][2]}</TableCell>
            <TableCell><a href={data[i][3]} target='_blank'>{data[i][3]}</a></TableCell>
            <TableCell><IconButton onClick={() => updateRowClick(i)}><InfoIcon style={{color: '#e8e8e8'}}/></IconButton></TableCell>
          </TableRow>
        );
      }
      
    }
    
  }
  return returnedLine;
}

function PrivateStatus(pub)
{
  if (pub === 0)
  {
    return <>Private Resource</>
  }
  else{
    return <>Public Resource</>
  }
}

function GenerateCheckboxs(data, updateRowMask){
  let returnedLine = [];
  for (let i = 0; i < data.length; i++)
  {
    returnedLine.push(
      <div key={i}>
        <label><input type="checkbox" defaultChecked onChange={() => updateRowMask(data[i][0])} />{data[i]}</label>
        <br />
        <br />
      </div>
    )
  }
  return returnedLine;
}


function GroupResources() {

 let resources = useGroupResources(groupID);
 let categories = useGroupResourceCategories(groupID);
 const [updateVersion, setUpdateVersion] = useState(0);

 function updateRowMask(cat)
{
  const isPresent = maskedCat.has(cat);
  if (isPresent)
  {
    maskedCat.delete(cat);
  }
  else
  {
    maskedCat.add(cat);
  }

  setUpdateVersion((current) => current +1);
}

function updateRowClick(row)
{
  clickedRow = row;
  setUpdateVersion((current) => current +1);
}

  if (resources[0] && categories[0])
    {
      return (
        <>
          <div className= "resources-group-header">
            <header className="group-title">Group Resources </header>
            <div className="button-format">
              <Button onClick={() => setOpenN(true)} variant="contained" color="secondary">+ Share New Resource</Button>
            </div>
          </div>
          <div className="group-table">
            <div className="left-table">
              <Table>
                    <TableCell>
                      {GenerateCheckboxs(categories[1], updateRowMask)}
                    </TableCell>
              </Table>
            </div>
            <div className="middle-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{fontWeight: 'bold'}}>Name</TableCell>
                    <TableCell style={{fontWeight: 'bold'}}>Website URL</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
              <Table>
                <div className="table-body-1">
                  <TableBody>
                    {GenerateRows(resources[1], updateRowClick)}
                  </TableBody>
                </div>
              </Table>
            </div>
            <div className="right-table">
            <Table>
                <TableHead>
                  <TableCell style={{fontWeight: 'bold'}}>Details</TableCell>
                </TableHead>
            </Table>
            <div className="table-body-2">
              <div className="tb2-header">{"Description"}</div>
              {resources[1][clickedRow][5]}
              <div style={{marginTop: '3rem', fontWeight: 'bold'}}>{PrivateStatus(resources[1][clickedRow][6])}</div>
              <div>Date Added: {resources[1][clickedRow][7]}</div>
              <div className="button-format">
                <Button onClick={() => setOpenN(true)} variant="contained" color="secondary">Modify</Button>
                <Button onClick={() => setOpenN(true)} variant="contained" style={{backgroundColor: '#e8e8e8', color: '#FF0000', marginLeft: '1rem'}}>Delete</Button>
              </div>
            </div>
            </div>
          </div>
          {<CommunityResources/>}
        </>
      )
    }
}

function GuestMessage() {
  return (
    <div className= "resources-group-header">
    <header className="group-title">Group Resources </header>
  </div>
  )
}

function CommunityResources() {
  
  return (
    <div style={{margin: '2rem'}}>
      <hr />
      <h2>Frequently Shared Resources</h2>
      <p> 
      When sharing group resources, users will be required to label each resource as either public or private. 
      If the user selects private, no further action will occur. 
      Conversely, if the user selects public, the community resources database will be updated. Specifically, novel resources will be added with a share value of one. 
      Whereas existing resources will have their share count increased by 1. 
      Here, community resources will be ranked by how often they are shared. 
      This will allow users to easily discover useful resources to share with their groups. 
      </p>
      <h3>Coming Soon ...</h3>
    </div>
  )
}



function Resources() {
  
  return (
    <div>
        {guest && <GuestMessage />}
        {user && <GroupResources />}
    </div>
  )
}

export default Resources;

/*
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
        <GuestMessage />
        <h2 style={{ textAlign: 'left', marginBottom: '0.20' }}>Frequently Shared Resources</h2>
        <hr />
        <p style={{ textAlign: 'left', marginTop: '0' }}>Resources are sorted into categories and ordered according to how often they are shared among study groups.
        </p>
      <div>
          <Accordion sx={{width: '100%'}}>
            <AccordionSummary expandIcon={'v'}>
            Practice Questions
            </AccordionSummary>
            <AccordionDetails>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align='right'>Link</TableCell>
                    <TableCell align='right'>Number of Shares</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{handleImage(res[0][2])}</TableCell>
                    <TableCell>{res[0][0]}</TableCell>
                    <TableCell align='right'><a href={res[0][1]} target='_blank'>{res[0][1]}</a></TableCell>
                    <TableCell align='right'>{res[0][3]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{handleImage(res[1][2])}</TableCell>
                    <TableCell>{res[1][0]}</TableCell>
                    <TableCell align='right'><a href={res[1][1]} target='_blank'>{res[1][1]}</a></TableCell>
                    <TableCell align='right'>{res[1][3]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{handleImage(res[2][2])}</TableCell>
                    <TableCell>{res[2][0]}</TableCell>
                    <TableCell align='right'><a href={res[2][1]} target='_blank'>{res[2][1]}</a></TableCell>
                    <TableCell align='right'>{res[2][3]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{handleImage(res[3][2])}</TableCell>
                    <TableCell>{res[3][0]}</TableCell>
                    <TableCell align='right'><a href={res[3][1]} target='_blank'>{res[3][1]}</a></TableCell>
                    <TableCell align='right'>{res[3][3]}</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{width: '100%'}}>
            <AccordionSummary expandIcon={'v'}>
            Tutorials
            </AccordionSummary>
            <AccordionDetails>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align='right'>Link</TableCell>
                    <TableCell align='right'>Number of Shares</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{handleImage(res[4][2])}</TableCell>
                    <TableCell>{res[4][0]}</TableCell>
                    <TableCell align='right'><a href={res[4][1]} target='_blank'>{res[4][1]}</a></TableCell>
                    <TableCell align='right'>{res[4][3]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{handleImage(res[5][2])}</TableCell>
                    <TableCell>{res[5][0]}</TableCell>
                    <TableCell align='right'><a href={res[5][1]} target='_blank'>{res[5][1]}</a></TableCell>
                    <TableCell align='right'>{res[5][3]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{handleImage(res[6][2])}</TableCell>
                    <TableCell>{res[6][0]}</TableCell>
                    <TableCell align='right'><a href={res[6][1]} target='_blank'>{res[6][1]}</a></TableCell>
                    <TableCell align='right'>{res[6][3]}</TableCell>
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
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align='right'>Link</TableCell>
                    <TableCell align='right'>Number of Shares</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{handleImage(res[7][2])}</TableCell>
                    <TableCell>{res[7][0]}</TableCell>
                    <TableCell align='right'><a href={res[7][1]} target='_blank'>{res[7][1]}</a></TableCell>
                    <TableCell align='right'>{res[7][3]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{handleImage(res[8][2])}</TableCell>
                    <TableCell>{res[8][0]}</TableCell>
                    <TableCell align='right'><a href={res[8][1]} target='_blank'>{res[8][1]}</a></TableCell>
                    <TableCell align='right'>{res[8][3]}</TableCell>
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
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align='right'>Link</TableCell>
                    <TableCell align='right'>Number of Shares</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{handleImage(res[9][2])}</TableCell>
                    <TableCell>{res[9][0]}</TableCell>
                    <TableCell align='right'><a href={res[9][1]} target='_blank'>{res[9][1]}</a></TableCell>
                    <TableCell align='right'>{res[9][3]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{handleImage(res[10][2])}</TableCell>
                    <TableCell>{res[10][0]}</TableCell>
                    <TableCell align='right'><a href={res[10][1]} target='_blank'>{res[10][1]}</a></TableCell>
                    <TableCell align='right'>{res[10][3]}</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </AccordionDetails>
          </Accordion>
      </div>
      </html>
    
); 
  }
}
  */

