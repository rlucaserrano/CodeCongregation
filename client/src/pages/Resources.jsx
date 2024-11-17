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
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab'; 
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import BuildIcon from '@mui/icons-material/Build'; //Practice Questions
import SchoolIcon from '@mui/icons-material/School'; //Tutorials
import VisibilityIcon from '@mui/icons-material/Visibility'; //Visualization Materials
import BookIcon from '@mui/icons-material/Book'; //Computer Science Theory
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary'; //Misc/Other
import { DialogContentText, IconButton, TableBody } from '@mui/material';
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
// 9. https://mui.com/material-ui/react-button-group/
// 10. https://legacy.reactjs.org/docs/hooks-effect.html


// Global resources. Will need to be updated for proper guest display and study group navigation.
let guest = false;
let user = true;
let groupID = "1";
let groupName = "Swamp Scripters"
let maskedCat = new Set();
let clickedRow = 0;
let clickedCRow = 0;
let resetClick = false;
let resetCClick = false;

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
      <>Contribute this information to help others discover valuable resources. Don't select if provided data contains personal information.</>
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

function useCommunityResources() {

  const [safe, setSafe] = useState(false)
  const [res, setRes] = useState()

  async function handleResGet()
  {
    let data = await fetch('http://localhost:8080/educationalresources', {
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
    handleResGet();
  }, []);

  return [safe, res];
}

// Taken, with slight modification, from Groups. 
function DeleteResourcePopUp({openD, handleCloseD, groupID, groupResourceID, resourceName}) {

  const handleCreate = async (e) =>
    {
        e.preventDefault()  
        await fetch('http://localhost:8080/groupresources', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: 'DELETE',
            body: JSON.stringify({
                'valGroupID': groupID,
                'valGroupResourceID': groupResourceID.toString()
            })
        });
        handleCloseD();
        window.location.reload();
    }

    return (
      <Dialog open={openD} onClose={handleCloseD}>
        <form method='post' onSubmit={handleCreate} style={{backgroundColor: '#ffffff', border: '2px solid #e8e8e8', minWidth: '30rem', maxWidth: '30rem', display: 'flex', flexDirection: 'column'}}>
          <DialogTitle style={{color: '#FF0000', fontWeight: 'bold', display: 'flex', justifyContent: 'center'}}>Delete Resource: {resourceName}</DialogTitle>
          <div style={{borderBottom: '2px solid #e8e8e8'}}></div>
          <DialogContentText style={{justifyContent: 'center', margin: '1rem'}}>Please note that deleted resources cannot be recovered. Are you sure you want to permanently delete {resourceName} from this group’s shared resources?</DialogContentText>
          <div style={{gap: '1rem', marginBottom: '1rem', justifyContent: 'center', display: 'flex'}}>
            <Button variant='contained' type='submit' style={{backgroundColor: '#FF0000'}}> Confirm Delete</Button>
            <Button variant='contained' onClick={handleCloseD} type='button' style={{backgroundColor: '#e8e8e8', color: '#FF0000'}}>Cancel</Button>
          </div>
        </form>
      </Dialog>
    );
}


function AddResourcePopUp({openC, handleCloseC, groupID}) {

  const [publicShare, setPublicShare] = useState("0");
  const [resourceName, setResourceName] = useState("");
  const [websiteURL, setWebsiteURL] = useState("");
  const [resourceCategory, setResourceCategory] = useState("");
  const [comCategory, setComCategory] = useState("");
  
  function displayCreateButton() {
  
    if (resourceName != "" && websiteURL != "" && resourceCategory != "" && comCategory != "")
    {
      return (<Button variant='contained' type='submit'>Share</Button>);
    }
    else {
      
      return (<Button variant='contained' style={{color: '#556cd6', background: '#ffffff', border: 'solid 1px #556cd6'}} disabled={true}>Share</Button>);
    }
  }

  const handleCreate = async (e) =>
    {
        e.preventDefault()
        const form = e.target;
        const formData = new FormData();
        const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

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
                'valReplacementCategory': comCategory,
                'source': 'group'
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
          <div style={{display: 'flex', margin: '0.5rem', width: '90%', gap: '1rem'}}>
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
          <div style={{margin: '0.5rem', display: 'flex', flexDirection: 'column'}}>
            <TextField required id="ResourceName" label="Resource Name" onChange={(input) => setResourceName(input.target.value)}/>
            <br/>
            <TextField required id="WebsiteURL" label="Website URL" onChange={(input) => setWebsiteURL(input.target.value)}/>
            <div style={{fontSize: 'small', marginTop: '1rem', marginBottom: '0.75rem'}}>Select the category that best describes this resource. Optionally, you can change the displayed category name to fit the needs of your group:</div>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <FormControl style={{flex: 1}}>
              <InputLabel required id="demo-simple-select-label">Resource Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={comCategory}
                label="Please select "
                onChange={(click) => {setComCategory(click.target.value); setResourceCategory(click.target.value)}}
              >
                  <MenuItem value={"Practice Questions"}>Practice Questions</MenuItem>
                  <MenuItem value={"Tutorials"}>Tutorials</MenuItem>
                  <MenuItem value={"Computer Science Theory"}>Computer Science Theory</MenuItem>
                  <MenuItem value={"Visualization Tools"}>Visualization Tools</MenuItem>
                  <MenuItem value={"Collaboration Tools"}>Collaboration Tools</MenuItem>
                  <MenuItem value={"Software Development Tools"}>Software Development Tools</MenuItem>
                  <MenuItem value={"Career Development"}>Career Development</MenuItem>
              </Select>
              </FormControl>
              <TextField style={{flex: 1.25}} required id="ResourceCategory" value={resourceCategory} label="Displayed Category Name" onChange={(input) => setResourceCategory(input.target.value)}/>
            </div>
            <br/>
            <TextField id="Description" label="Description" multiline minRows={3}/>
          </div>
          <div style={{gap: '1rem', marginBottom: '1rem', justifyContent: 'center', display: 'flex'}}>
            {displayCreateButton()}
            <Button variant='contained' onClick={handleCloseC} type='button' style={{backgroundColor: '#e8e8e8', color: '#FF0000'}}>Cancel</Button>
          </div>
        </form>
      </Dialog>
    );
}

function FeedbackPopUp({openF, handleCloseF, resourceID}) {

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  
  function displaySubmitButton() {
  
    if (description != "" && category != "")
    {
      return (<Button variant='contained' type='submit'>Submit</Button>);
    }
    else {
      
      return (<Button variant='contained' style={{color: '#556cd6', background: '#ffffff', border: 'solid 1px #556cd6'}} disabled={true}>Submit</Button>);
    }
  }

  const handleCreate = async (e) =>
    {
        e.preventDefault()

        await fetch('http://localhost:8080/feedback', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: 'POST',
            body: JSON.stringify({
                'valDescription': description,
                'valCategory': category,
                'valResourceID': resourceID
            })
        });
        handleCloseF();
        window.location.reload();

    }

    return (
      <Dialog open={openF} onClose={handleCloseF}>
        <form method='post' onSubmit={handleCreate} style={{backgroundColor: '#ffffff', border: '2px solid #e8e8e8', minWidth: '30rem', maxWidth: '30rem', display: 'flex', flexDirection: 'column'}}>
          <DialogTitle style={{color: '#556cd6', fontWeight: 'bold', display: 'flex', justifyContent: 'center'}}>Submit Feedback</DialogTitle>
          <div style={{margin: '0.5rem', display: 'flex', flexDirection: 'column'}}>
            <TextField required id="ResourceName" label="Feedback Topic" onChange={(input) => setCategory(input.target.value)}/>
            <br/>
            <TextField required id="description" label="Description" onChange={(input) => setDescription(input.target.value)}/>
            <br/>
          </div>
          <div style={{gap: '1rem', marginBottom: '1rem', justifyContent: 'center', display: 'flex'}}>
            {displaySubmitButton()}
            <Button variant='contained' onClick={handleCloseF} type='button' style={{backgroundColor: '#e8e8e8', color: '#FF0000'}}>Cancel</Button>
          </div>
        </form>
      </Dialog>
    );

}

function CommunitySharePopUp({openS, handleCloseS, groupID, comResourceID, comResourceName, comWebsiteURL, prevResourceCategory, prevResourceDescription, comShares})
{
  const [link, setLink] =  useState(comWebsiteURL);
  let newShare = parseInt(comShares) + 1;
  
  const handleCreate = async (e) =>
    {
      
      e.preventDefault()
        await fetch('http://localhost:8080/educationalresources', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: 'PATCH',
            body: JSON.stringify({
              'valResourceID': comResourceID,
              'valVotes': newShare.toString()
            })
        });

        await fetch('http://localhost:8080/groupresources', {
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
          method: 'POST',
          body: JSON.stringify({
              'valGroupID': groupID,
              'valResourceName': comResourceName,
              'valWebsiteURL': link,
              'valDescription': prevResourceDescription,
              'valResourceCategory': prevResourceCategory,
              'valPublicShare': "1",
          })
      });
        
      handleCloseS();
      window.location.reload();
    }

    return (
      <Dialog open={openS} onClose={handleCloseS}>
        <form method='post' onSubmit={handleCreate} style={{backgroundColor: '#ffffff', border: '2px solid #e8e8e8', minWidth: '30rem', maxWidth: '30rem', display: 'flex', flexDirection: 'column'}}>
          <DialogTitle style={{color: '#556cd6', fontWeight: 'bold', display: 'flex', justifyContent: 'center'}}>Share Resource: {comResourceName}</DialogTitle>
          <div style={{borderBottom: '2px solid #e8e8e8'}}></div>
          <div style={{margin:'1rem'}}>{comResourceName} will be added to {groupName}’s shared resources, and its information will be updated to suggest similar resources in the future.</div>
          <div style={{margin:'1rem', borderTop: '1px solid #556cd6', paddingTop:'1rem'}}>By default, {comResourceName}'s homepage will be shared. If available, select a different link from the dropdown to share a specific page.</div>
          <Accordion sx={{margin: '1rem', border: '1px solid #556cd6'}}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{color: '#556cd6'}}/>}>
            Pages
            </AccordionSummary>
            <AccordionDetails>
              <FormControl style={{flex: '25%'}}>
                <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                defaultValue={comWebsiteURL}
                >
                  <DisplayOtherPages homePage={comWebsiteURL} setLink={setLink}/>
                </RadioGroup>
              </FormControl>
            </AccordionDetails>
          </Accordion>
          <div style={{gap: '1rem', marginBottom: '1rem', justifyContent: 'center', display: 'flex'}}>
            <Button variant='contained' type='submit'>Confirm Share</Button>
            <Button variant='contained' onClick={handleCloseS} type='button' style={{backgroundColor: '#e8e8e8', color: '#FF0000'}}>Cancel</Button>
          </div>
        </form>
      </Dialog>
    );
}

function ModifyResourcePopUp({openM, handleCloseM, groupID, groupResourceID, prevResourceName, prevWebsiteURL, prevResourceCategory, prevResourceDescription}) {

  const [resourceName, setResourceName] = useState(prevResourceName);
  const [websiteURL, setWebsiteURL] = useState(prevWebsiteURL);
  const [resourceCategory, setResourceCategory] = useState(prevResourceCategory);
  const [resourceDescription, setResourceDescription] = useState(prevResourceDescription);

  function displayModifyButton() {
  
    if (resourceName != "" && websiteURL != "" && resourceCategory != "")
    {
      return (<Button variant='contained' type='submit'>Modify</Button>);
    }
    else {
      
      return (<Button variant='contained' style={{color: '#556cd6', background: '#ffffff', border: 'solid 1px #556cd6'}} disabled={true}>Modify</Button>);
    }
  }

  const handleCreate = async (e) =>
    {
        e.preventDefault()
      const form = e.target;
        await fetch('http://localhost:8080/groupresources', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: 'PATCH',
            body: JSON.stringify({
              'valGroupID': groupID.toString(),
              'valGroupResourceID': groupResourceID.toString(),
              'valResourceName': form.ResourceName.value,
              'valWebsiteURL': form.WebsiteURL.value,
              'valDescription': form.Description.value,
              'valResourceCatehory': form.ResourceCategory.value,
            })
        });
        handleCloseM();
        window.location.reload();

    }

    return (
      <Dialog open={openM} onClose={handleCloseM}>
        <form method='post' onSubmit={handleCreate} style={{backgroundColor: '#ffffff', border: '2px solid #e8e8e8', minWidth: '30rem', maxWidth: '30rem', display: 'flex', flexDirection: 'column'}}>
          <DialogTitle style={{color: '#556cd6', fontWeight: 'bold', display: 'flex', justifyContent: 'center'}}>Modify Resource: {prevResourceName}</DialogTitle>
          <div style={{borderBottom: '2px solid #e8e8e8'}}></div>
          <div style={{margin: '1rem', display: 'flex', flexDirection: 'column'}}>
            <TextField required id="ResourceName" label="Resource Name" value={resourceName} onChange={(input) => setResourceName(input.target.value)}/>
            <br/>
            <TextField required id="WebsiteURL" label="Website URL" value={websiteURL} onChange={(input) => setWebsiteURL(input.target.value)}/>
            <br/>
            <TextField required id="ResourceCategory" label="Resource Category" value={resourceCategory} onChange={(input) => setResourceCategory(input.target.value)}/>
            <br/>
            <TextField id="Description" value ={resourceDescription} label="Description" onChange={(input) => setResourceDescription(input.target.value)} multiline minRows={4}/>
          </div>
          <div style={{gap: '1rem', marginBottom: '1rem', justifyContent: 'center', display: 'flex'}}>
            {displayModifyButton()}
            <Button variant='contained' onClick={handleCloseM} type='button' style={{backgroundColor: '#e8e8e8', color: '#FF0000'}}>Cancel</Button>
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
            <TableCell style={{textAlign: 'center', overflow: 'hidden',textOverflow: 'ellipsis', fontWeight: 'bold'}}><a href={data[i][3]} target='_blank'>{data[i][3]}</a></TableCell>
            <TableCell style={{textAlign: 'right', overflow: 'hidden'}}><InfoIcon style={{color: '#e8e8e8'}}/></TableCell>
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

function GenerateCRows(data, updateCRowClick, category){

  // Iterates through array to generate and return rows of the table.
  if (resetCClick === true)
  {
    clickedCRow = 0;
    resetCClick = false;
  }
  let returnedLine = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i][3] === category) {
      if (i == clickedCRow) {
        returnedLine.push(
          <TableRow style={{backgroundColor: '#f7f7f8'}}>
            <TableCell style={{textAlign: 'left', overflow: 'hidden', fontWeight: 'bold'}}>{data[i][7]}</TableCell>
            <TableCell style={{textAlign: 'left', overflow: 'hidden', fontWeight: 'bold'}}>{data[i][1]}</TableCell>
            <TableCell style={{textAlign: 'center', overflow: 'hidden',textOverflow: 'ellipsis', fontWeight: 'bold'}}><a href={data[i][2]} target='_blank'>{data[i][2]}</a></TableCell>
            <TableCell style={{textAlign: 'right', overflow: 'hidden'}}><InfoIcon style={{color: '#e8e8e8'}}/></TableCell>
          </TableRow>
        );
      }
      else {
        returnedLine.push(
          <TableRow>
            <TableCell style={{textAlign: 'left', overflow: 'hidden'}}>{data[i][7]}</TableCell>
            <TableCell style={{textAlign: 'left', overflow: 'hidden'}}>{data[i][1]}</TableCell>
            <TableCell style={{textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis'}}><a href={data[i][2]} target='_blank'>{data[i][2]}</a></TableCell>
            <TableCell style={{textAlign: 'right', overflow: 'hidden'}}><IconButton onClick={() => updateCRowClick(i)}><InfoIcon style={{color: '#e8e8e8'}}/></IconButton></TableCell>
          </TableRow>
        );
      }
    }
    else if (i == clickedCRow) {
      clickedCRow = clickedCRow + 1;
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

function GenerateCategoryButtons(data, setcurrCat, currCat)
{
  let returnedLine = [];
  for (let i = 0; i < data.length; i++)
  {
    if(currCat === data[i]) {
      returnedLine.push(
      <div key={i}>
        <Button onClick={() => {resetCClick = true, setcurrCat(data[i])}} fullWidth sx={{border: '#ffffff solid 2px', borderRadius: 0, height: '3.62rem', backgroundColor: '#556cd6', fontWeight: 'bold', color: '#ffffff'}}>{data[i]}</Button>
      </div>
    )
  }
  else {
    returnedLine.push(
      <div key={i}>
        <Button onClick={() => {resetCClick = true, setcurrCat(data[i])}} fullWidth sx={{border: '#ffffff solid 2px', borderRadius: 0, height: '3.62rem', backgroundColor: '#e8e8e8', color: '#1c1c1e'}}>{data[i]}</Button>
      </div>
    )
  }
  }
  return returnedLine;
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

function DisplayOtherPages({homePage, setLink}) {

  const [safe, setSafe] = useState(false)
  const [res, setRes] = useState([])

  async function handleResGet()
  {
    let data = await fetch('http://localhost:8080/webpages', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({ 
          'HomePage': homePage,
          'Action': 'GET'
        }),
        method: 'POST'
    })
    setRes(await data.json());
    setSafe(true)  
  }

  useEffect(() => {
    handleResGet();
  }, []);

  //<FormControlLabel value="0" control={<Radio />} label="Group" onClick={() => setPublicShare("0")}/>
  //<FormControlLabel value="1" control={<Radio />} label="Community" onClick={() => setPublicShare("1")} />

  if (!safe) {
    return (<CircularProgress />);
  }

  if (res.length === 0) {
    console.log("Here1");
    return (<> 
    <FormControlLabel value={homePage} control={<Radio />} label={<a href={homePage} target='_blank' style={{textAlign: 'center', overflow: 'hidden',textOverflow: 'ellipsis', fontWeight: 'bold'}}>{homePage}</a>} onClick={() => setLink(homePage)}/>
    </>)
  }
  else {
    let returnedLine = [];
    returnedLine.push(<FormControlLabel value={homePage} control={<Radio />} label={<a href={homePage} target='_blank' style={{textAlign: 'center', overflow: 'hidden',textOverflow: 'ellipsis', fontWeight: 'bold'}}>{homePage}</a>} onClick={() => setLink(homePage)}/>);
    for (let i = 0; i < res.length; i++) {
      returnedLine.push(<FormControlLabel value={res[i][1]} control={<Radio />} label={<a href={res[i][1]} target='_blank' style={{textAlign: 'center', overflow: 'hidden',textOverflow: 'ellipsis', fontWeight: 'bold'}}>{res[i][1]}</a>} onClick={() => setLink(res[i][1])}/>);
    }
    return returnedLine;
  }
}

function validCClick(resources, setOpenS, setOpenF){

  if (resources[1] && resources[1].length > clickedCRow)
  {
    return(
      <TableRow>
        <div className="tb2-header">{"Description"}</div>
        {resources[1][clickedCRow][4]}
        <div style={{marginTop: '1rem', wordWrap: 'break-word', wordBreak: 'break-all'}}><a href={resources[1][clickedCRow][2]} target='_blank'>{resources[1][clickedCRow][2]}</a></div>
        <div style={{marginTop: '1rem'}}><span style={{fontWeight: 'bold'}}>Community Shares: </span>{resources[1][clickedCRow][7]}</div>
        <div style={{marginTop: '1rem', marginBottom: '1rem'}}>Date Added: {resources[1][clickedCRow][6]}</div>
        <div className='button-format'>
          <Button onClick={() => setOpenS(true)} variant="contained" color="secondary">+ Share with {groupName}</Button>
          <Button onClick={() => setOpenF(true)} variant="contained" style={{backgroundColor: '#e8e8e8', color: '#556cd6', marginLeft: '1rem'}}>Feedback</Button>
        </div>
      </TableRow>
    )
  }
  else 
  {
    return(
      <div className="table-body-2">
        <div className="tb2-empty">{"This Category is Empty"}</div>
        There are currently no shared resources in this category. Do you know of any that we are missing? Consider sharing it to help grow our resources!
      </div>
    )
  }
}

function validClick(resources, setOpenD, setOpenM){

  if (resources[1] && resources[1].length > clickedRow)
  {
    return(
      <TableRow>
        <div className="tb2-header">{"Description"}</div>
        {resources[1][clickedRow][5]}
        <br/>
        <br/>
        <dev style={{marginTop: '1rem', wordWrap: 'break-word', wordBreak: 'break-all'}}><a href={resources[1][clickedRow][3]} target='_blank'>{resources[1][clickedRow][3]}</a></dev>
        <div style={{marginTop: '2rem', fontWeight: 'bold'}}>{PrivateStatus(resources[1][clickedRow][6])}</div>
        <div>Date Added: {resources[1][clickedRow][7]}</div>
        <div className="button-format">
          <Button onClick={() => setOpenM(true)} variant="contained" color="secondary">Modify</Button>
          <Button onClick={() => setOpenD(true)} variant="contained" style={{backgroundColor: '#e8e8e8', color: '#FF0000', marginLeft: '1rem'}}>Delete</Button>
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
 const [openD, setOpenD] = React.useState(false);
 const [openM, setOpenM] = React.useState(false);

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

if (!resources[0] || !categories[0])
{
  return (
    <div style={{margin: '15rem', display: 'flex', justifyContent: 'center'}}>
      <CircularProgress />
    </div>
  )
}

if (resources[0] && categories[0])
    {
      return (
        <>
          <div className= "resources-group-header">
            <header className="group-title">{groupName}</header>
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
                    <TableCell style={{fontWeight: 'bold', width: '33%'}}>Name</TableCell>
                    <TableCell style={{fontWeight: 'bold', width: '34%'}}>Website URL</TableCell>
                    <TableCell style={{marginRight: '1.5rem', textAlign: 'right', fontWeight: 'bold', width: '33%'}}>▶</TableCell>
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
            <Table style={{ tableLayout: 'fixed', width: '100%', borderBottom: '1px solid #e8e8e8'}}>
                <TableHead>
                  <tableRow >
                    <TableCell style={{fontWeight: 'bold'}}>Details</TableCell>
                  </tableRow>
                </TableHead>
            </Table>
            <div className="table-body-2">
              <Table style={{tableLayout: 'fixed', width: '100%'}}>
                <TableBody>
                  {validClick(resources, setOpenD, setOpenM)}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
          {openC && <AddResourcePopUp openC={openC} handleCloseC={() => setOpenC(false)} groupID={groupID}/>}
          {openD && <DeleteResourcePopUp openD={openD} handleCloseD={() => setOpenD(false)} groupID={groupID} groupResourceID={resources[1][clickedRow][1]} resourceName={resources[1][clickedRow][2]}/>}
          {openM && <ModifyResourcePopUp openM={openM} handleCloseM={() => setOpenM(false)} groupID={groupID} groupResourceID={resources[1][clickedRow][1]} prevResourceName={resources[1][clickedRow][2]} prevWebsiteURL={resources[1][clickedRow][3]} prevResourceCategory={resources[1][clickedRow][4]} prevResourceDescription={resources[1][clickedRow][5]}/>}
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


function CommunityResources() 
{
  let resources = useCommunityResources();
  const [updateVersion, setUpdateVersion] = useState(0);
  const [openS, setOpenS] = React.useState(false);
  const [openF, setOpenF] = React.useState(false);
  const [currCat, setcurrCat] = React.useState("Practice Questions")
  const [clickedTab, setTab] = React.useState(0);
  const [displayFrequently, setDisplayFrequency] = useState(true);

  const handleChange = (click, newValue) => {
    setTab(newValue);
    setDisplayFrequency(newValue === 0);
  }

  function updateCRowClick(row)
  {
    clickedCRow = row;
    setUpdateVersion((current) => current +1);
  }

  function DisplayFrequently({resources, updateCRowClick, currCat})
  {
    return(
      <>
        <div className="middle-table">
          <Table style={{ tableLayout: 'fixed', width: '100%'}}>
            <TableHead>
              <TableRow>
                <TableCell style={{fontWeight: 'bold', width: '33%'}}>Shares</TableCell>
                <TableCell style={{fontWeight: 'bold', width: '33%'}}>Name</TableCell>
                <TableCell style={{fontWeight: 'bold', width: '34%'}}>Website URL</TableCell>
                <TableCell style={{marginRight: '1.5rem', textAlign: 'right', fontWeight: 'bold', width: '34%'}}>▶</TableCell>
              </TableRow>
            </TableHead>
          </Table>
          <div className="table-body-1">
            <Table style={{ tableLayout: 'fixed', width: '100%'}}>
                <TableBody>
                  {GenerateCRows(resources[1], updateCRowClick, currCat)}
                </TableBody>
            </Table>
          </div>
        </div>
        <div className="right-table">
          <Table style={{ tableLayout: 'fixed', width: '100%', borderBottom: '1px solid #e8e8e8'}}>
            <TableHead>
              <tableRow>
                <TableCell style={{fontWeight: 'bold'}}>Details</TableCell>
              </tableRow>
            </TableHead>
          </Table>
          <div className="table-body-2">
            <Table style={{tableLayout: 'fixed', width: '100%'}}>
              <TableBody>
                {validCClick(resources, setOpenS, setOpenF)}
              </TableBody>
            </Table>
          </div>
        </div>
      </>
    );
  }

   function DisplayRecommended()
   {
      return (
        <div className="table-body-1">
            <Table style={{ tableLayout: 'fixed', width: '100%'}}>
                <TableBody>
                  <TableCell style={{fontWeight: 'bold', padding: '2rem', fontSize: '17px', backgroundColor: '#ffffff'}}>Recommended resources are currently unavailable for {groupName}. Recommendations are generated based on the public resources shared by your group members. Keep sharing resources with public visibility to unlock your recommendations!</TableCell>
                </TableBody>
            </Table>
          </div>

      )
   }

if (!resources[0])
{
  return (
    <div style={{margin: '15rem', display: 'flex', justifyContent: 'center'}}>
      <CircularProgress />
    </div>
  )
}

if (resources[0])
    {
      return (
        <>
          <div className= "resources-group-header">
            <header className="group-title">Community Resources</header>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', marginRight: '2rem'}}>
              <Tabs value={clickedTab} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Frequently Shared"sx={{'&:hover': { backgroundColor: 'transparent'}}}/>
              <Tab label="Recommended" sx={{'&:hover': { backgroundColor: 'transparent' }}}/>
              </Tabs>
            </Box>
          </div>
          <div className="community-table">
            <div className="left-table">
                <ButtonGroup style={{width: '100%', height: '100%'}} orientation="vertical" size = "large" varient="text" aria-label="Basic button group">
                  {GenerateCategoryButtons(["Practice Questions", "Tutorials", "Computer Science Theory", "Visualization Tools", "Collaboration Tools", "Software Development Tools", "Career Development"], setcurrCat, currCat)}
                </ButtonGroup>
            </div>
            {displayFrequently && <DisplayFrequently resources={resources} updateCRowClick={updateCRowClick} currCat={currCat}/>}
            {!displayFrequently && <DisplayRecommended/>}
        </div>
        {openS && <CommunitySharePopUp openS={openS} handleCloseS={() => setOpenS(false)} groupID={groupID} comResourceID={resources[1][clickedCRow][0]} comResourceName={resources[1][clickedCRow][1]} comWebsiteURL={resources[1][clickedCRow][2]} prevResourceCategory={resources[1][clickedCRow][3]} prevResourceDescription={resources[1][clickedCRow][4]} comShares={resources[1][clickedCRow][7]}/>}
        {openF && <FeedbackPopUp openF={openF} handleCloseF={() => setOpenF(false)} resourceID={resources[1][clickedCRow][0]}/>}
        </>
      )
    }

}

function Resources() {

  const [clickedButton, setClickedButton] = useState("group");

  function CurrentDisplay()
  {
    if (clickedButton === "group")
    {
      return (
        <>
        {guest && <GuestMessage />}
        {user && <GroupResources />}
        </>
      )
    }
    if ((clickedButton === "community"))
    {
      return (<CommunityResources/>)
    }
  }

  function buttonStyle(button)
  {
    if (button === clickedButton)
    {
      return ({backgroundColor: '#f1f4fe', border: '#1c1c1e 2px solid', color:'#1c1c1e', fontWeight: 'bold', outline: 'none'})
    }
    else
    {
      return ({backgroundColor: '#f1f4fe', border: '#1c1c1e 1px solid', color:'#1c1c1e'})
    }
  }

  return (
    <div>
        <div class='main-title'>Resources</div>
        <ButtonGroup style={{marginLeft: '2.5%'}} size = "large" varient="text" aria-label="Basic button group">
          <Button onClick={() => {resetClick = true, setClickedButton("group")}} style={buttonStyle("group")}>Group</Button>
          <Button onClick={() => {resetCClick = true, setClickedButton("community")}} style={buttonStyle("community")}>Community</Button>
        </ButtonGroup>
        {<CurrentDisplay/>}
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