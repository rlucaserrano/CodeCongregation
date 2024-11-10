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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import BuildIcon from '@mui/icons-material/Build'; //Practice Questions
import SchoolIcon from '@mui/icons-material/School'; //Tutorials
import VisibilityIcon from '@mui/icons-material/Visibility'; //Visualization Materials
import BookIcon from '@mui/icons-material/Book'; //Computer Science Theory
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary'; //Misc/Other
import { IconButton, TableBody } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { CheckBox, Terminal } from '@mui/icons-material';



// Sources used to create Resources.jsx
// 1. https://mui.com/material-ui/
// 2. https://www.w3schools.com/js/js_loop_for.asp
// 3. https://www.robinwieruch.de/react-checkbox/
// 4. https://www.geeksforgeeks.org/how-to-declare-global-variables-in-javascript/
// 5. https://www.w3schools.com/js/js_set_methods.asp
// 6. https://mui.com/material-ui/react-dialog/
// 7. https://mui.com/material-ui/react-radio-button/
// 8. https://www.geeksforgeeks.org/how-to-disable-a-button-in-reactjs/

// Global resources. Will need to be updated for proper guest display and study group navigation.
let guest = false;
let user = true;
let groupID = "2";
let maskedCat = new Set();
let clickedRow = 0;
let resetClick = false;

function displayDescription(vis) {
  
  if (vis === '0')
  {
    return (
      <>Share resources privately with your group members.</>
    )
  }
  else
  {
    return (
      <>Contribute your sharing activity to help community members discover valuable resources.</>
    )
  }
}

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



// Taken, with slight modification, from Groups. 
function AddGroupPopUp({openC, handleCloseC, groupID}) {

  const [publicShare, setPublicShare] = useState("0");
  const [resourceName, setResourceName] = useState("");
  const [websiteURL, setWebsiteURL] = useState("");
  const [resourceCategory, setResourceCategory] = useState("");

  function displayCreateButton() {
  
    console.log(resourceName);
    console.log(websiteURL);
    console.log(resourceCategory);
    if (resourceName != "" && websiteURL != "" && resourceCategory != "")
    {
      return (<Button variant='contained' type='submit'>Create</Button>);
    }
    else {
      
      return (<Button variant='contained' style={{color: '#556cd6', background: '#ffffff', border: 'solid 1px #556cd6'}} disabled={true}>Create</Button>);
    }
  }

  const handleCreate = async (e) =>
    {
        e.preventDefault()
        const form = e.target;
        const formData = new FormData();
        const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

        console.log(groupID);
        console.log(id);
        console.log(form.ResourceName.value);
        console.log(form.WebsiteURL.value);
        console.log(form.Description.value);
        console.log(publicShare);
        await fetch('http://localhost:8080/groupresources', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: 'POST',
            body: JSON.stringify({
                'valGroupID': groupID,
                'valResourceName': form.ResourceName.value,
                'valWebsiteURL': form.WebsiteURL.value,
                'valDescription':form.Description.value,
                'valResourceCategory': form.ResourceCategory.value,
                'valPublicShare': publicShare.toString(),
            })
        });
        handleCloseC();
        window.location.reload();

    }

    return (
      <Dialog open={openC} onClose={handleCloseC}>
        <form method='post' onSubmit={handleCreate} style={{backgroundColor: '#ffffff', border: '2px solid #e8e8e8', minWidth: '30rem', maxWidth: '30rem', display: 'flex', flexDirection: 'column'}}>
          <DialogTitle style={{color: '#556cd6', fontWeight: 'bold', display: 'flex', justifyContent: 'center'}}>Share New Resource</DialogTitle>
          <div style={{borderBottom: '2px solid #e8e8e8'}}></div>
          <div style={{display: 'flex', margin: '1rem', width: '90%', gap: '1rem'}}>
            <FormControl style={{flex: '25%'}}>
              <FormLabel id="demo-controlled-radio-buttons-group" style={{fontWeight: 'bold'}}>Visibility</FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                defaultValue={"0"}
              >
                <FormControlLabel value="0" control={<Radio />} label="Group" onClick={() => setPublicShare("0")}/>
                <FormControlLabel value="1" control={<Radio />} label="Community" onClick={() => setPublicShare("1")} />
              </RadioGroup>
            </FormControl>
            <div style={{flex: '60%', marginLeft: '1rem', alignContent: 'center', color: '#2e3945'}}>
              {displayDescription(publicShare)}
            </div>
          </div>
          <div style={{margin: '1rem', display: 'flex', flexDirection: 'column'}}>
            <TextField required id="ResourceName" label="Resource Name" onChange={(input) => setResourceName(input.target.value)}/>
            <br/>
            <TextField required id="WebsiteURL" label="Website URL" onChange={(input) => setWebsiteURL(input.target.value)}/>
            <br/>
            <TextField required id="ResourceCategory" label="Resource Category" onChange={(input) => setResourceCategory(input.target.value)}/>
            <br/>
            <TextField id="Description" label="Description" multiline minRows={4}/>
          </div>
          <div style={{gap: '1rem', marginBottom: '1rem', justifyContent: 'center', display: 'flex'}}>
            {displayCreateButton()}
            <Button variant='contained' onClick={handleCloseC} type='button' style={{backgroundColor: '#e8e8e8', color: '#FF0000'}}>Cancel</Button>
          </div>
        </form>
      </Dialog>
    );
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
  if (resetClick === true)
  {
    clickedRow = 0;
    resetClick = false;
  }
  let returnedLine = [];
  for (let i = 0; i < data.length; i++) {
    if (!maskedCat.has(data[i][4])) {
      if (i == clickedRow) {
        returnedLine.push(
          <TableRow style={{backgroundColor: '#f7f7f8'}}>
            <TableCell style={{textAlign: 'left', overflow: 'hidden', fontWeight: 'bold'}}>{data[i][2]}</TableCell>
            <TableCell ><a href={data[i][3]} target='_blank' style={{textAlign: 'left', overflow: 'hidden', fontWeight: 'bold'}}>{data[i][3]}</a></TableCell>
            <TableCell></TableCell>
          </TableRow>
        );
      }
      else {
        returnedLine.push(
          <TableRow>
            <TableCell style={{textAlign: 'left', overflow: 'hidden'}}>{data[i][2]}</TableCell>
            <TableCell style={{textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis'}}><a href={data[i][3]} target='_blank'>{data[i][3]}</a></TableCell>
            <TableCell style={{textAlign: 'right', overflow: 'hidden'}}><IconButton onClick={() => updateRowClick(i)}><InfoIcon style={{color: '#e8e8e8'}}/></IconButton></TableCell>
          </TableRow>
        );
      }

    }
    else if (i == clickedRow) {
      clickedRow = clickedRow + 1;
    }

  }
  return returnedLine;
}

function PrivateStatus(pub)
{
  if (pub === 0)
  {
    return <>Group Resource</>
  }
  else{
    return <>Community Resource</>
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

function validClick(resources){

  if (resources[1] && resources[1].length > clickedRow)
  {
    return(
      <TableRow>
        <div className="tb2-header">{"Description"}</div>
        {resources[1][clickedRow][5]}
        <br/>
        <br/>
        <dev style={{marginTop: '1rem', overflow: 'hidden', textOverflow: 'ellipsis'}}><a href={resources[1][clickedRow][3]} target='_blank'>{resources[1][clickedRow][3]}</a></dev>
        <div style={{marginTop: '2rem', fontWeight: 'bold'}}>{PrivateStatus(resources[1][clickedRow][6])}</div>
        <div>Date Added: {resources[1][clickedRow][7]}</div>
        <div className="button-format">
          <Button onClick={() => setOpenN(true)} variant="contained" color="secondary">Modify</Button>
          <Button onClick={() => setOpenN(true)} variant="contained" style={{backgroundColor: '#e8e8e8', color: '#FF0000', marginLeft: '1rem'}}>Delete</Button>
        </div>
      </TableRow>
    )
  }
  else 
  {
    return(
      <div className="table-body-2">
        <div className="tb2-empty">{"No Resource Selected"}</div>
        Please select at least one resource category to continue exploring shared group resources.
      </div>
    )
  }
}

function GroupResources() {

 let resources = useGroupResources(groupID);
 let categories = useGroupResourceCategories(groupID);
 const [updateVersion, setUpdateVersion] = useState(0);
 const [openC, setOpenC] = React.useState(false);

 function updateRowMask(cat)
{
  if (maskedCat.size === categories[1].length)
  {
    resetClick = true;
  }
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
              <Button onClick={() => setOpenC(true)} variant="contained" color="secondary">+ Share New Resource</Button>
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
              <Table style={{ tableLayout: 'fixed', width: '100%'}}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{fontWeight: 'bold', width: '50%'}}>Name</TableCell>
                    <TableCell style={{fontWeight: 'bold', width: '50%'}}>Website URL</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
              <div className="table-body-1">
                <Table style={{ tableLayout: 'fixed', width: '100%'}}>
                    <TableBody>
                      {GenerateRows(resources[1], updateRowClick)}
                    </TableBody>
                </Table>
              </div>
            </div>
            <div className="right-table">
            <Table style={{ tableLayout: 'fixed', width: '100%'}}>
                <TableHead>
                  <tableRow>
                    <TableCell style={{fontWeight: 'bold'}}>Details</TableCell>
                  </tableRow>
                </TableHead>
            </Table>
            <div className="table-body-2">
              <Table style={{tableLayout: 'fixed', width: '100%'}}>
                <TableBody>
                  {validClick(resources)}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
          {<CommunityResources/>}
          {openC && <AddGroupPopUp openC={openC} handleCloseC={() => setOpenC(false)} groupID={groupID}/>}
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
@@ -62,92 +324,83 @@ function Resources() {
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
        <GuestMessage />
        <h2 style={{ textAlign: 'left', marginBottom: '0.20' }}>Frequently Shared Resources</h2>
        <hr />
        <p style={{ textAlign: 'left', marginTop: '0' }}>Resources are sorted into categories and ordered according to how often they are shared among study groups.
        </p>
      <div>
          <Accordion sx={{width: '100%'}}>
            <AccordionSummary expandIcon={'v'}>
            Tutorials
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
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align='right'>Link</TableCell>
                    <TableCell align='right'>Number of Shares</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{handleImage(res[4][2])}</TableCell>
                    <TableCell>{res[4][0]}</TableCell>
                    <TableCell align='right'><a href={res[4][1]} target='_blank'>{res[4][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[4][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
                    <TableCell>{handleImage(res[0][2])}</TableCell>
                    <TableCell>{res[0][0]}</TableCell>
                    <TableCell align='right'><a href={res[0][1]} target='_blank'>{res[0][1]}</a></TableCell>
                    <TableCell align='right'>{res[0][3]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{handleImage(res[5][2])}</TableCell>
                    <TableCell>{res[5][0]}</TableCell>
                    <TableCell align='right'><a href={res[5][1]} target='_blank'>{res[5][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[5][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
                    <TableCell>{handleImage(res[1][2])}</TableCell>
                    <TableCell>{res[1][0]}</TableCell>
                    <TableCell align='right'><a href={res[1][1]} target='_blank'>{res[1][1]}</a></TableCell>
                    <TableCell align='right'>{res[1][3]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{handleImage(res[6][2])}</TableCell>
                    <TableCell>{res[6][0]}</TableCell>
                    <TableCell align='right'><a href={res[6][1]} target='_blank'>{res[6][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[6][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
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
            Practice Questions
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
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align='right'>Link</TableCell>
                    <TableCell align='right'>Number of Shares</TableCell>
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
                    <TableCell>{handleImage(res[4][2])}</TableCell>
                    <TableCell>{res[4][0]}</TableCell>
                    <TableCell align='right'><a href={res[4][1]} target='_blank'>{res[4][1]}</a></TableCell>
                    <TableCell align='right'>{res[4][3]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{res[2][2]}</TableCell>
                    <TableCell>{res[2][0]}</TableCell>
                    <TableCell align='right'><a href={res[2][1]} target='_blank'>{res[2][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[2][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
                    <TableCell>{handleImage(res[5][2])}</TableCell>
                    <TableCell>{res[5][0]}</TableCell>
                    <TableCell align='right'><a href={res[5][1]} target='_blank'>{res[5][1]}</a></TableCell>
                    <TableCell align='right'>{res[5][3]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{res[3][2]}</TableCell>
                    <TableCell>{res[3][0]}</TableCell>
                    <TableCell align='right'><a href={res[3][1]} target='_blank'>{res[3][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[3][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
                    <TableCell>{handleImage(res[6][2])}</TableCell>
                    <TableCell>{res[6][0]}</TableCell>
                    <TableCell align='right'><a href={res[6][1]} target='_blank'>{res[6][1]}</a></TableCell>
                    <TableCell align='right'>{res[6][3]}</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
@@ -161,22 +414,22 @@ function Resources() {
            <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Resource Icon</TableCell>
                    <TableCell>Resource Name</TableCell>
                    <TableCell align='right'>Resource Link</TableCell>
                    <TableCell align='right'>Votes</TableCell>
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align='right'>Link</TableCell>
                    <TableCell align='right'>Number of Shares</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{res[7][2]}</TableCell>
                    <TableCell>{handleImage(res[7][2])}</TableCell>
                    <TableCell>{res[7][0]}</TableCell>
                    <TableCell align='right'><a href={res[7][1]} target='_blank'>{res[7][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[7][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
                    <TableCell align='right'>{res[7][3]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{res[8][2]}</TableCell>
                    <TableCell>{handleImage(res[8][2])}</TableCell>
                    <TableCell>{res[8][0]}</TableCell>
                    <TableCell align='right'><a href={res[8][1]} target='_blank'>{res[8][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[8][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
                    <TableCell align='right'>{res[8][3]}</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
@@ -190,39 +443,32 @@ function Resources() {
            <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Resource Icon</TableCell>
                    <TableCell>Resource Name</TableCell>
                    <TableCell align='right'>Resource Link</TableCell>
                    <TableCell align='right'>Votes</TableCell>
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align='right'>Link</TableCell>
                    <TableCell align='right'>Number of Shares</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{res[9][2]}</TableCell>
                    <TableCell>{handleImage(res[9][2])}</TableCell>
                    <TableCell>{res[9][0]}</TableCell>
                    <TableCell align='right'><a href={res[9][1]} target='_blank'>{res[9][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[9][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
                    <TableCell align='right'>{res[9][3]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{res[10][2]}</TableCell>
                    <TableCell>{handleImage(res[10][2])}</TableCell>
                    <TableCell>{res[10][0]}</TableCell>
                    <TableCell align='right'><a href={res[10][1]} target='_blank'>{res[10][1]}</a></TableCell>
                    <TableCell align='right'><Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↑</Button>{res[10][3]}<Button variant='contained' sx={{minWidth:25, width:25, minHeight:25, height:25}}>↓</Button></TableCell>
                    <TableCell align='right'>{res[10][3]}</TableCell>
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
    
); 
  }
}
  */