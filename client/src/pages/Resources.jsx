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
import { DialogContentText, IconButton, TableBody } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

/* Purpose: This file is used to generate the frontend components associated with accessing group and community resources. 
Regarding group resources, users can view group resources, filter resources by category, and add, modify or delete resources. 
As to community resources, users can access both frequently shared resources and recommended resources for the group you are currently logged into.  
Frequently shared orders resources by number of shares for each category. 
Recommended resources suggests resources shared by other groups, if the public sharing activity is similar to the user’s current group. */

/* Sources used to create Resources.jsx
1. https://mui.com/material-ui/
2. https://www.w3schools.com/js/js_loop_for.asp
3. https://www.robinwieruch.de/react-checkbox/
4. https://www.geeksforgeeks.org/how-to-declare-global-variables-in-javascript/
5. https://www.w3schools.com/js/js_set_methods.asp
6. https://mui.com/material-ui/react-dialog/
7. https://mui.com/material-ui/react-radio-button/
8. https://www.geeksforgeeks.org/how-to-disable-a-button-in-reactjs/
9. https://mui.com/material-ui/react-button-group/
10. https://legacy.reactjs.org/docs/hooks-effect.html
11. https://stackoverflow.com/questions/49421792/how-to-use-material-uinext-textfield-error-props
12. https://stackoverflow.com/questions/30970068/js-regex-url-validation
13. https://www.geeksforgeeks.org/how-to-get-the-length-of-a-string-in-bytes-in-javascript/ 
*/

/* Page Layout:
1. Global variable assignment
2. Global helper functions
3. Hooks for initial database access 
4. Pop up commonents - add, modify, delete resources
5. Main feature subcomponents (Part 1) - Resource rows
6. Main feature subcomponents (Part 2) - Selected resource details 
7. Main feature displays - Handles guest message, group resources, and community resources displays
8. Base component - handles overall display based on account attributes (guest/user) and navigation (group/community toggle)
*/

/*==== 1. Global variable assignment ====*/

// Assigns specific global variables with data from current group.

let groupID = localStorage.getItem('groupID');
let groupName = localStorage.getItem('groupName');
let guest = false;
let user = false;
if (groupID === null)
{
  guest = true;
}
else {
  user = true
}

// Assigns remaining global variables with defualt values

// Currently masked categories
let maskedCat = new Set();

// Clicked row for group resources, frequently shared community resources, and recommended resources; respectively
let clickedRow = 0; 
let clickedCRow = 0;
let clickedRRow = 0;

// Resets clicked row for group resources, frequently shared community resources, and recommended resources; respectively
let resetClick = false;
let resetCClick = false;
let resetRClick = false;

/*==== 2. Global helper functions ====*/

// Displays description of resource type
function DisplayVisDescription(vis) {
  
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

// Displays resource type
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

// Generates category buttons for subset displays
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

// Generates checkbox for filtering
function GenerateGroupCheckboxs(data, UpdateRowMask){
  let returnedLine = [];
  for (let i = 0; i < data.length; i++)
  {
    returnedLine.push(
      <div key={i}>
        <label><input type="checkbox" defaultChecked onChange={() => UpdateRowMask(data[i][0])} />{data[i]}</label>
        <br />
        <br />
      </div>
    )
  }
  return returnedLine;
}

// Displays specific pages so users can share subsets of community resources
function DisplayOtherPages({homePage, setLink}) {

  const [safe, setSafe] = useState(false)
  const [res, setRes] = useState([])

  // Calls backend to access website table
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


  if (!safe) {
    return (<CircularProgress />);
  }

  // Returns all pages associated with the website
  if (res.length === 0) {
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

/*==== 3. Hooks for initial database access ====*/

// Sends initial request for group resources
function useGroupResources(currGroupID) {

  // Declares state variables 
  const [safe, setSafe] = useState(false)
  const [res, setRes] = useState()

  // Sends request to backend when main feature is navigated to. 
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

// Sends initial request for frequently shared resources
function useCommunityResources() {

  // Declares state variables 
  const [safe, setSafe] = useState(false)
  const [res, setRes] = useState()

  // Sends request to backend when main feature is navigated to. 
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
// Sends initial request for recommended resources
function useRecResources(currGroupID) {

  // Declares state variables 
  const [safe, setSafe] = useState(false)
  const [res, setRes] = useState()

  // Sends request to backend when main feature is navigated to. 
  async function handleResGet()
  {
    let data = await fetch('http://localhost:8080/recommendations', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({ 
          'valGroupID': currGroupID,
        }),
        method: 'POST'
    })
    setRes(await data.json());
    setSafe(true)  
  }

  useEffect(() => {
    handleResGet();
  }, []);

  return [safe, res];
}

// Sends initial request for group resource categories
function useGroupResourceCategories(currGroupID) {

  // Declares state variables 
  const [safe, setSafe] = useState(false)
  const [res, setRes] = useState()

  // Sends request to backend when main feature is navigated to. 
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

/*==== 4. Pop up commonents - add, modify, delete resources ====*/

// Allows users to delete group resources (but not community resources)
function DeleteResourcePopUp({openD, handleCloseD, groupID, groupResourceID, resourceName}) {

  // Sends delete request and resource details after action is confirmed.
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

    // Displays instructions, input fields, and buttons.
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

// Updates group resources (and community resources if public visibility is selected)
function AddResourcePopUp({openC, handleCloseC, groupID}) {

  // Declares and assigns state variables.
  const [publicShare, setPublicShare] = useState("0");
  const [resourceName, setResourceName] = useState("");
  const [websiteURL, setWebsiteURL] = useState("");
  const [resourceCategory, setResourceCategory] = useState("");
  const [comCategory, setComCategory] = useState("");
  const [invalidURL, setInvalidURL] = useState("");
  const [invalidName, setInvalidName] = useState("");
  const [invalidDescription, setInvalidDescription] = useState("");
  const [invalidCategory, setInvalidCategory] = useState("");
  
  // Displays create button, disabled unless constraints are met. 
  function DisplayCreateButton() {
  
    if (resourceName != "" && websiteURL != "" && resourceCategory != "" && comCategory != "" && invalidURL == "" && invalidName == "" && invalidDescription == "" && invalidCategory == "")
    {
      return (<Button variant='contained' type='submit'>Share</Button>);
    }
    else {
      
      return (<Button variant='contained' style={{color: '#556cd6', background: '#ffffff', border: 'solid 1px #556cd6'}} disabled={true}>Share</Button>);
    }
  }

  // Validates website url using regular expression.
  function CheckWebsiteURL(url) {
    
    if (!url.match((/^(https?:\/\/)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/))) {
      setInvalidURL("Invalid input - please copy and paste the full website url.");
    }
    else if (new Blob([url]).size > 300) {
      setInvalidURL("Invalid input - provided url is too long. Please double check accuracy.");
    }
    else{
      setInvalidURL("");
    }
  }

  // Validates user input to ensure SQL friendly
  function CheckInput(input, size, setter) {
    if (new Blob([input]).size > size) {
      setter("Invalid input - please reduce length.");
    }
    else if (!input.match((/^([a-zA-Z0-9_!?., ]*)$/)))
    {
      setter("Invalid input - only letters, numbers, spaces, and special characters !?_ are allowed.");
    }
    else {
      setter("");
    }
  }

  // Calls database and passes inputted data
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

    // Displays instructions, input fields, and buttons.
    return (
      <Dialog open={openC} onClose={handleCloseC}>
        <form method='post' onSubmit={handleCreate} style={{backgroundColor: '#ffffff', border: '2px solid #e8e8e8', minWidth: '30rem', maxWidth: '30rem', display: 'flex', flexDirection: 'column'}}>
          <DialogTitle style={{color: '#556cd6', fontWeight: 'bold', display: 'flex', justifyContent: 'center'}}>Share New Resource</DialogTitle>
          <div style={{borderBottom: '2px solid #e8e8e8'}}></div>
          <div style={{display: 'flex', margin: '0.5rem', width: '90%', gap: '1rem'}}>
            <FormControl style={{flex: '25%'}}>
              <FormLabel id="vis-controlled-radio-buttons-group" style={{fontWeight: 'bold'}}>Visibility</FormLabel>
              <RadioGroup
                aria-labelledby="vis-controlled-radio-buttons-group"
                name="vis-controlled-radio-buttons-group"
                defaultValue={"0"}
              >
                <FormControlLabel value="0" control={<Radio />} label="Group" onClick={() => setPublicShare("0")}/>
                <FormControlLabel value="1" control={<Radio />} label="Community" onClick={() => setPublicShare("1")} />
              </RadioGroup>
            </FormControl>
            <div style={{flex: '60%', marginLeft: '1rem', alignContent: 'center', color: '#2e3945'}}>
              {DisplayVisDescription(publicShare)}
            </div>
          </div>
          <div style={{margin: '0.5rem', display: 'flex', flexDirection: 'column'}}>
            <TextField required id="ResourceName" label="Resource Name" onChange={(input) => {setResourceName(input.target.value), CheckInput(input.target.value, 100, setInvalidName)}} error={invalidName !== ""} helperText={invalidName}/>
            <br/>
            <TextField required id="WebsiteURL" label="Website URL" onChange={(input) => {setWebsiteURL(input.target.value), CheckWebsiteURL(input.target.value)}} error={invalidURL !== ""} helperText={invalidURL}/>
            <br/>
            <FormControl style={{flex: 1}}>
            <InputLabel required id="resource-category-label">Resource Category</InputLabel>
            <Select
              labelId="resource-category-label"
              id="resource-category-select"
              value={comCategory}
              label="Please select"
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
            <br/>
            <TextField style={{flex: 1.25}} required id="ResourceCategory" value={resourceCategory} label="Displayed Category (Customizable)" onChange={(input) => {setResourceCategory(input.target.value), CheckInput(input.target.value, 300, setInvalidCategory)}} error={invalidCategory !== ""} helperText={invalidCategory}/>
            <br/>
            <TextField id="Description" label="Description" multiline minRows={3} onChange={(input) => CheckInput(input.target.value, 300, setInvalidDescription)} error={invalidDescription !== ""} helperText={invalidDescription}/>
          </div>
          <div style={{gap: '1rem', marginBottom: '1rem', justifyContent: 'center', display: 'flex'}}>
            {DisplayCreateButton()}
            <Button variant='contained' onClick={handleCloseC} type='button' style={{backgroundColor: '#e8e8e8', color: '#FF0000'}}>Cancel</Button>
          </div>
        </form>
      </Dialog>
    );
}

// Requests feedback details and send to database.
function FeedbackPopUp({openF, handleCloseF, resourceID}) {

  // Declares and assigns state variables.
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  
  // Displays submit button, button is  disabled unless constraints are met.
  function DisplaySubmitButton() {
  
    if (description != "" && category != "")
    {
      return (<Button variant='contained' type='submit'>Submit</Button>);
    }
    else {
      
      return (<Button variant='contained' style={{color: '#556cd6', background: '#ffffff', border: 'solid 1px #556cd6'}} disabled={true}>Submit</Button>);
    }
  }

  // Calls database and passes feedback data.
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

    // Displays instructions, input fields, and buttons.
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
            {DisplaySubmitButton()}
            <Button variant='contained' onClick={handleCloseF} type='button' style={{backgroundColor: '#e8e8e8', color: '#FF0000'}}>Cancel</Button>
          </div>
        </form>
      </Dialog>
    );

}

// Sends resource data to backend to share with current group.
function RecSharePopUp({openRecS, handleCloseRecS, groupID, comResourceID, comResourceName, comWebsiteURL, prevResourceCategory, prevResourceDescription, comShares})
{
  // Updates the share count of the resource.
  let newShare = parseInt(comShares) + 1;
  
  // Calls database to update group data
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
              'valWebsiteURL': comWebsiteURL,
              'valDescription': prevResourceDescription,
              'valResourceCategory': prevResourceCategory,
              'valPublicShare': "1",
          })
      });
        
      handleCloseRecS();
      window.location.reload();
    }

    // Displays instructions, input fields, and buttons.
    return (
      <Dialog open={openRecS} onClose={handleCloseRecS}>
        <form method='post' onSubmit={handleCreate} style={{backgroundColor: '#ffffff', border: '2px solid #e8e8e8', minWidth: '30rem', maxWidth: '30rem', display: 'flex', flexDirection: 'column'}}>
          <DialogTitle style={{color: '#556cd6', fontWeight: 'bold', display: 'flex', justifyContent: 'center'}}>Share Resource: {comResourceName}</DialogTitle>
          <div style={{borderBottom: '2px solid #e8e8e8'}}></div>
          <div style={{margin:'2rem'}}>{comResourceName} will be added to {groupName}’s shared resources, and its information will be updated to suggest similar resources in the future.</div>
          <div style={{gap: '1rem', marginBottom: '1rem', justifyContent: 'center', display: 'flex'}}>
            <Button variant='contained' type='submit'>Confirm Share</Button>
            <Button variant='contained' onClick={handleCloseRecS} type='button' style={{backgroundColor: '#e8e8e8', color: '#FF0000'}}>Cancel</Button>
          </div>
        </form>
      </Dialog>
    );
}

// Sends resource data to backend to share with current group.
function CommunitySharePopUp({openS, handleCloseS, groupID, comResourceID, comResourceName, comWebsiteURL, prevResourceCategory, prevResourceDescription, comShares})
{
  // Declares and assigns state variables.
  const [link, setLink] =  useState(comWebsiteURL);
  let newShare = parseInt(comShares) + 1;
  
  // Calls database to update group data.
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

    // Displays instructions, input fields, and buttons.
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
                aria-labelledby="pages-radio-buttons-group"
                name="pages-buttons-group"
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

// Modify display for group resources
function ModifyResourcePopUp({openM, handleCloseM, groupID, groupResourceID, prevResourceName, prevWebsiteURL, prevResourceCategory, prevResourceDescription}) {

  // Declares and assigns state variables.
  const [resourceName, setResourceName] = useState(prevResourceName);
  const [websiteURL, setWebsiteURL] = useState(prevWebsiteURL);
  const [resourceCategory, setResourceCategory] = useState(prevResourceCategory);
  const [resourceDescription, setResourceDescription] = useState(prevResourceDescription);
  const [invalidURL, setInvalidURL] = useState("");
  const [invalidName, setInvalidName] = useState("");
  const [invalidDescription, setInvalidDescription] = useState("");
  const [invalidCategory, setInvalidCategory] = useState("");

  // Displays modify button, disabled until constraints are met.
  function DisplayModifyButton() {
  
    if (resourceName != "" && websiteURL != "" && resourceCategory != "" && invalidURL == "" && invalidName == "" && invalidDescription == "" && invalidCategory == "")
    {
      return (<Button variant='contained' type='submit'>Modify</Button>);
    }
    else {
      
      return (<Button variant='contained' style={{color: '#556cd6', background: '#ffffff', border: 'solid 1px #556cd6'}} disabled={true}>Modify</Button>);
    }
  }

  // Ensures valid website URL using regular expressions
  function CheckWebsiteURL(url) {
    
    if (!url.match((/^(https?:\/\/)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/))) {
      setInvalidURL("Invalid input - please copy and paste the full website url.");
    }
    else if (new Blob([url]).size > 300) {
      setInvalidURL("Invalid input - provided url is too long. Please double check accuracy.");
    }
    else{
      setInvalidURL("");
    }
  }

  // Ensures SQL friendly input.
  function CheckInput(input, size, setter) {
    if (new Blob([input]).size > size) {
      setter("Invalid input - please reduce length.");
    }
    else if (!input.match((/^([a-zA-Z0-9_!?., ]*)$/)))
    {
      setter("Invalid input - only letters, numbers, spaces, and special characters !?_ are allowed.");
    }
    else {
      setter("");
    }
  }

  // Calls database and passes modified values.
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

    // Displays instructions, input fields, and buttons.
    return (
      <Dialog open={openM} onClose={handleCloseM}>
        <form method='post' onSubmit={handleCreate} style={{backgroundColor: '#ffffff', border: '2px solid #e8e8e8', minWidth: '30rem', maxWidth: '30rem', display: 'flex', flexDirection: 'column'}}>
          <DialogTitle style={{color: '#556cd6', fontWeight: 'bold', display: 'flex', justifyContent: 'center'}}>Modify Resource: {prevResourceName}</DialogTitle>
          <div style={{borderBottom: '2px solid #e8e8e8'}}></div>
          <div style={{margin: '1rem', display: 'flex', flexDirection: 'column'}}>
            <TextField required id="ResourceName" label="Resource Name" value={resourceName} onChange={(input) => {setResourceName(input.target.value), CheckInput(input.target.value, 100, setInvalidName)}} error={invalidName !== ""} helperText={invalidName}/>
            <br/>
            <TextField required id="WebsiteURL" label="Website URL" value={websiteURL} onChange={(input) => {setWebsiteURL(input.target.value), CheckWebsiteURL(input.target.value)}} error={invalidURL !== ""} helperText={invalidURL}/>
            <br/>
            <TextField required id="ResourceCategory" label="Resource Category" value={resourceCategory} onChange={(input) => {setResourceCategory(input.target.value), CheckInput(input.target.value, 300, setInvalidCategory)}} error={invalidCategory !== ""} helperText={invalidCategory}/>
            <br/>
            <TextField id="Description" value ={resourceDescription} label="Description" onChange={(input) => {setResourceDescription(input.target.value), CheckInput(input.target.value, 300, setInvalidDescription)}} error={invalidDescription !== ""} helperText={invalidDescription} multiline minRows={4}/>
          </div>
          <div style={{gap: '1rem', marginBottom: '1rem', justifyContent: 'center', display: 'flex'}}>
            {DisplayModifyButton()}
            <Button variant='contained' onClick={handleCloseM} type='button' style={{backgroundColor: '#e8e8e8', color: '#FF0000'}}>Cancel</Button>
          </div>
        </form>
      </Dialog>
    );
}

/*==== 5. Main feature subcomponents (Part 1) - Resource rows ====*/

// Generates group rows
function GenerateGroupRows(data, UpdateGroupRowClick){

  // Iterates through array to generate and return rows of the table.
  if (resetClick === true)
  {
    // Resets click if reset event has occurred. 
    clickedRow = 0;
    resetClick = false;
  }
  let returnedLine = [];
  // Generates rows if not filtered out. Changes format for clicked vs not clicked rows. 
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
            <TableCell style={{textAlign: 'right', overflow: 'hidden'}}><IconButton onClick={() => UpdateGroupRowClick(i)}><InfoIcon style={{color: '#e8e8e8'}}/></IconButton></TableCell>
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

// Generates community rows for recommended
function GenerateRecRows(data, UpdateRecRowClick) 
{
   // Iterates through array to generate and return rows of the table.
   
   if (resetRClick === true)
    {
      // Resets click if reset event occured.
      clickedRRow = 0;
      resetRClick = false;
    }

    // Returns error messages if group does not qualify. 
   if (data[0] === false)
   {
    return (
      <div style={{display: 'flex', justifyContent: 'center', paddingTop: '1rem'}}>
        <CircularProgress />
      </div>);
   }

   if (data[1].Result == "Error: Group does not have public resources" || data[1].Result == "Error: No sufficently similar groups")
   {
    return (<></>)
   }
   else if (data[0] === true)
   {
    let returnedLine = [];
    // Generates rows. Changes format for clicked vs not clicked resources.
    for (let i = 0; i < data[1].Result.length; i++) 
      {
        if (i ==clickedRRow)
        {
          returnedLine.push(
            <TableRow style={{backgroundColor: '#f7f7f8'}}>
              <TableCell style={{textAlign: 'left', overflow: 'hidden', fontWeight: 'bold'}}>{data[1].Result[i][4]}</TableCell>
              <TableCell style={{textAlign: 'left', overflow: 'hidden', fontWeight: 'bold'}}>{data[1].Result[i][1]}</TableCell>
              <TableCell style={{textAlign: 'center', overflow: 'hidden',textOverflow: 'ellipsis', fontWeight: 'bold'}}><a href={data[1].Result[i][0]} target='_blank'>{data[1].Result[i][0]}</a></TableCell>
              <TableCell style={{textAlign: 'right', overflow: 'hidden'}}><InfoIcon style={{color: '#e8e8e8'}}/></TableCell>
            </TableRow>
          );
        }
        else
        {
          returnedLine.push(
            <TableRow>
              <TableCell style={{textAlign: 'left', overflow: 'hidden'}}>{data[1].Result[i][4]}</TableCell>
              <TableCell style={{textAlign: 'left', overflow: 'hidden'}}>{data[1].Result[i][1]}</TableCell>
              <TableCell style={{textAlign: 'center', overflow: 'hidden',textOverflow: 'ellipsis', fontWeight: 'bold'}}><a href={data[1].Result[i][0]} target='_blank'>{data[1].Result[i][0]}</a></TableCell>
              <TableCell style={{textAlign: 'right', overflow: 'hidden'}}><IconButton onClick={() => UpdateRecRowClick(i)}><InfoIcon style={{color: '#e8e8e8'}}/></IconButton></TableCell>
            </TableRow>
          );
        }   
      }
    return returnedLine;
   }
}

// Generates community rows for frequently shared
function GenerateComRows(data, UpdateComRowClick, category){

  // Iterates through array to generate and return rows of the table.
  if (resetCClick === true)
  {
    // Resets clicked row if reset event occurs
    clickedCRow = 0;
    resetCClick = false;
  }
  // Generates rows, if of selected category. Changes format for clicked vs not clicked resources.
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
            <TableCell style={{textAlign: 'right', overflow: 'hidden'}}><IconButton onClick={() => UpdateComRowClick(i)}><InfoIcon style={{color: '#e8e8e8'}}/></IconButton></TableCell>
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

/*==== 6. Main feature subcomponents (Part 2) - Selected resource details ====*/

// Community recommended resources details
function RecRowDetails(resources, setOpenRecS){

  // Displays extra loading displays as recommendations are calculated. 
  if (!resources[1])
  {
    return (
      <div style={{display: 'flex', justifyContent: 'center', paddingTop: '1rem'}}>
      Loading . . .
      </div>);
  }

  // Displays error messages if user's current group is not eligible for recommendations
  if (resources[1].Result == "Error: Group does not have public resources")
  {
    return(
      <div className="table-body-2">
        <div className="tb2-empty">{"Recommendations Not Available"}</div>
        We cannot recommend any resources to your group until you start sharing resources publicly.
      </div>
    )
  }
  else if (resources[1].Result == "Error: No sufficently similar groups")
  {
    return(
      <div className="table-body-2">
        <div className="tb2-empty">{"Recommendations Not Available"}</div>
        We cannot recommend any resources to your group because your sharing activity is not sufficiently similar to that of any other groups.
      </div>
    )
  }
  else
  {
      // Displays recommendations.
      return(
        <TableRow>
          <div className="tb2-header">{"Description"}</div>
          {resources[1].Result[clickedRRow][3]}
          <div style={{marginTop: '1rem', wordWrap: 'break-word', wordBreak: 'break-all'}}><a href={resources[1].Result[clickedRRow][0]} target='_blank'>{resources[1].Result[clickedRRow][0]}</a></div>
          <div style={{marginTop: '1rem'}}><span style={{fontWeight: 'bold'}}>Community Shares: </span>{resources[1].Result[clickedRRow][4]}</div>
          <div className='button-format'>
            <Button onClick={() => setOpenRecS(true)} variant="contained" color="secondary">+ Share with {groupName}</Button>
          </div>
        </TableRow>
      )
  }
}

// Community frequently shared resource details
function ComRowDetails(resources, setOpenS, setOpenF){

  // If community resources loaded, displays details for currently selected resource.
  if (resources[1] && resources[1].length > clickedCRow)
  {
     if (user) {
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
     else {
      return(
        <TableRow>
          <div className="tb2-header">{"Description"}</div>
          {resources[1][clickedCRow][4]}
          <div style={{marginTop: '1rem', wordWrap: 'break-word', wordBreak: 'break-all'}}><a href={resources[1][clickedCRow][2]} target='_blank'>{resources[1][clickedCRow][2]}</a></div>
          <div style={{marginTop: '1rem'}}><span style={{fontWeight: 'bold'}}>Community Shares: </span>{resources[1][clickedCRow][7]}</div>
          <div style={{marginTop: '1rem', marginBottom: '1rem'}}>Date Added: {resources[1][clickedCRow][6]}</div>
        </TableRow>
      )
     }
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

// Group resource details
function GroupRowDetails(resources, setOpenD, setOpenM){

  // Generates resource details for currently selected row
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
    // If all resources filtered out, informs user. 
    return(
      <div className="table-body-2">
        <div className="tb2-empty">{"No Resource Selected"}</div>
        Please select at least one resource category to continue exploring shared group resources.
      </div>
    )
  }
}

/*==== 7. Main feature displays - Handles guest message, group resources, and community resources displays ====*/

// Group resources display
function GroupResources() {

 // Access data from backend and establishes state variables.
  let resources = useGroupResources(groupID);
 let categories = useGroupResourceCategories(groupID);
 const [updateVersion, setUpdateVersion] = useState(0);
 const [openC, setOpenC] = React.useState(false);
 const [openD, setOpenD] = React.useState(false);
 const [openM, setOpenM] = React.useState(false);

 // Local function to allow category filtering. 
 function UpdateRowMask(cat)
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

// Local function to allow users to click on specific resources.
function UpdateGroupRowClick(row)
{
  clickedRow = row;
  setUpdateVersion((current) => current +1);
}

// Displays loading symbol until resources are returned from the backend.
if (!resources[0] || !categories[0])
{
  return (
    <div style={{margin: '15rem', display: 'flex', justifyContent: 'center'}}>
      <CircularProgress />
    </div>
  )
}

// Once resources are returned, displays group resources structure. 
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
                      {GenerateGroupCheckboxs(categories[1], UpdateRowMask)}
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
                      {GenerateGroupRows(resources[1], UpdateGroupRowClick)}
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
                  {GroupRowDetails(resources, setOpenD, setOpenM)}
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

// Guest message to explain purpose. 
function GuestMessage() {
  return (
    <>
      <div className= "resources-group-header">
        <header className="group-title">Welcome, Guest!</header>
      </div>
          <Table style={{background: '#ffffff', fontWeight: 'bold', border: 'solid 1px #1c1c1e', marginLeft: '2.5%', marginRight: '2.5%', height: '10rem', display: 'flex', justifyContent: 'center', width: '95%', alignItems: 'center'}}>
                After signing up, join or create your first group to start sharing resources. Meanwhile, check out our community resources to begin learning!
          </Table>
          <div className="table-body-1">
            <Table style={{ tableLayout: 'fixed', width: '100%'}}>
                <TableBody>
                </TableBody>
            </Table>
        </div>
    </>
  )
}

// Community resources display
function CommunityResources() 
{
  
  // Gets data from backend and sets state variables.
  let resources = useCommunityResources();
  const [updateVersion, setUpdateVersion] = useState(0);
  const [openS, setOpenS] = React.useState(false);
  const [openF, setOpenF] = React.useState(false);
  const [currCat, setcurrCat] = React.useState("Practice Questions")
  const [clickedTab, setTab] = React.useState(0);
  const [displayFrequently, setDisplayFrequency] = useState(true);

  // Local functions to handle user activity on the community resources display

  const handleChange = (click, newValue) => {
    setTab(newValue);
    setDisplayFrequency(newValue === 0);
  }

  function UpdateComRowClick(row)
  {
    clickedCRow = row;
    setUpdateVersion((current) => current +1);
  }

  // Displays frequently shared resources, organized by category and ranked by share count.
  function DisplayFrequently({resources, UpdateComRowClick, currCat})
  {
    return(
        <div className="community-table">
            <div className="left-table">
                <ButtonGroup style={{width: '100%', height: '100%'}} orientation="vertical" size = "large" varient="text" aria-label="Basic button group">
                  {GenerateCategoryButtons(["Practice Questions", "Tutorials", "Computer Science Theory", "Visualization Tools", "Collaboration Tools", "Software Development Tools", "Career Development"], setcurrCat, currCat)}
                </ButtonGroup>
            </div>
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
                    {GenerateComRows(resources[1], UpdateComRowClick, currCat)}
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
                  {ComRowDetails(resources, setOpenS, setOpenF)}
                </TableBody>
              </Table>
            </div>
          </div>
      </div>
    );
  }

  // Displays recommended resources based on group sharing activity. 
   function DisplayRecommended(UpdateComRowClick)
   {
    let resources = useRecResources(groupID)
    const [updateVersion, setUpdateVersion] = useState(0);
    const [openRecS, setOpenRecS] = React.useState(false);


    // Local function to handle user activity in recommended resources
    function UpdateRecRowClick(row)
    {
      clickedRRow = row;
      setUpdateVersion((current) => current +1);
    }
    
    // Displays description, instead of functionality, for guest users.
    if (guest === true)
        {
          return (
            <div className="table-body-1">
              <Table style={{background: '#ffffff', fontWeight: 'bold', border: 'solid 1px #1c1c1e', marginLeft: '2.5%', marginRight: '2.5%', height: '10rem', display: 'flex', justifyContent: 'center', width: '95%', alignItems: 'center'}}>
                After signing up, join or create your first group to start sharing resources. Meanwhile, check out our community resources to begin learning!
              </Table>
            </div>
          )
        } 
    

    // Returns recommended resources.
    return (
      <>
      <div className="community-table">
          <div className="left-table-rec">
            <div style={{margin: '1rem'}}> Resources are recommended if they have been found useful by groups similar to yours. Similarity is determined by analyzing each group's public sharing activity.</div>
          </div>
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
                {GenerateRecRows(resources, UpdateRecRowClick)}
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
                {RecRowDetails(resources, setOpenRecS)}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {openRecS && <RecSharePopUp openRecS={openRecS} handleCloseRecS={() => setOpenRecS(false)} groupID={groupID} comResourceID={resources[1].Result[clickedRRow][5]} comResourceName={resources[1].Result[clickedRRow][1]} comWebsiteURL={resources[1].Result[clickedRRow][0]} prevResourceCategory={resources[1].Result[clickedRRow][2]} prevResourceDescription={resources[1].Result[clickedRRow][3]} comShares={resources[1].Result[clickedRRow][4]}/>}
      </>
  );
   }

// Displays loading sign while waiting for resources.
if (!resources[0])
{
  return (
    <div style={{margin: '15rem', display: 'flex', justifyContent: 'center'}}>
      <CircularProgress />
    </div>
  )
}

// After resources returned from backend, displays community resources structure.
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
            {displayFrequently && <DisplayFrequently resources={resources} UpdateComRowClick={UpdateComRowClick} currCat={currCat}/>}
            {!displayFrequently && <DisplayRecommended UpdateComRowClick={UpdateComRowClick}/>}
        {openS && <CommunitySharePopUp openS={openS} handleCloseS={() => setOpenS(false)} groupID={groupID} comResourceID={resources[1][clickedCRow][0]} comResourceName={resources[1][clickedCRow][1]} comWebsiteURL={resources[1][clickedCRow][2]} prevResourceCategory={resources[1][clickedCRow][3]} prevResourceDescription={resources[1][clickedCRow][4]} comShares={resources[1][clickedCRow][7]}/>}
        {openF && <FeedbackPopUp openF={openF} handleCloseF={() => setOpenF(false)} resourceID={resources[1][clickedCRow][0]}/>}
        </>
      )
    }

}

/*==== 8. Base component - handles overall display based on account attributes (guest/user) and navigation (group/community toggle) ====*/

function Resources() {

  const [clickedButton, setClickedButton] = useState("group");

  // Local function to display table of resources, toggle between group and community resources.
  function CurrentDisplay()
  {
    
    if (clickedButton === "group")
    {
      // Group resource display changes depending on account type
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

  // Local function to handle group/community display button
  function ButtonStyle(button)
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
          <Button onClick={() => {resetClick = true, setClickedButton("group")}} style={ButtonStyle("group")}>Group</Button>
          <Button onClick={() => {resetCClick = true, resetRClick = true, setClickedButton("community")}} style={ButtonStyle("community")}>Community</Button>
        </ButtonGroup>
        {<CurrentDisplay/>}
    </div>
  )
}

export default Resources;