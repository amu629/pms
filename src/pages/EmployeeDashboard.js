import React, { useEffect, useRef } from "react";
import "./EmployeeDashboard.css";
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import {TabList, TabPanel, TabContext} from '@mui/lab';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import {Button} from '@mui/joy';


const EmployeeDashboard = (props) => {
  const [value, setValue] = React.useState('1');
  const [edit, setEdit] = React.useState(false);
  const [empDetails, setEmpDetails] = React.useState(null);
  const empDetailsRef = useRef(props);

  useEffect(() => {
    setEmpDetails(props)
  }, [props]);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEdit = () => {
    setEdit(true);
  }

  const handleCancel = () => {
    setEdit(false);
    setEmpDetails(empDetailsRef.current);
  }

  const handleSubmit = () => {
    const email = empDetails.details.email;
    const goals = empDetails.details.goals;
    const updateGoals = async (email, goals) => {
      try {
          const response = await fetch(`http://localhost:3333/api/details/updateAllGoals/${email}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ goals: goals }),
          });
          const data = await response.json();
          if(data.status === '200') {
              alert('Goals updated successfully');
              setEdit(false);
              empDetailsRef.current = empDetails;
          }
      } catch (error) {
          console.error('Error updating Goals:', error);
      }
    };
    updateGoals(email, goals);
  }

  const editGoalValue = (e, index) => {
    const newStatus = e.target.value;
    const updatedGoals = empDetails.details.goals.map((goal, i) => {
      if (i === index) {
        return { ...goal, status: newStatus };
      }
      return goal;
    });
    setEmpDetails({ ...empDetails, details: { ...empDetails.details, goals: updatedGoals } });
  }
  
  return (
    
    <div className="dashboard-container">
      <div style={{textAlign: "center"}}>
        <h1>Employee Dashboard</h1>
      </div>
      {empDetails &&
        <>
          <div>
            <Avatar sx={{ bgcolor: deepOrange[500] }}>{empDetails.details.name.charAt(0)}</Avatar>
            <h2 style={{color: "blueviolet"}}>{empDetails.details.name}</h2>
          </div>
          <br/><br/><br/><br/>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'bisque' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="Employee Details" value="1"/>
                  <Tab label="Goals" value="2" />
                  <Tab label="Feedback" value="3"/>
                </TabList>
              </Box>

              <TabPanel value="1">
                <div style={{display: "flex", gap: "250px"}}>
                  <div>
                    <div style={{marginBottom: "10px"}}>
                      <label>Name: </label>
                      <span>{empDetails.details.name}</span>
                    </div>
                    <div style={{marginBottom: "10px"}}>
                      <label>Phone No.: </label>
                      <span>{empDetails.details.phoneNo}</span>
                    </div>
                    <div style={{marginBottom: "10px"}}>
                      <label>Email: </label>
                      <span>{empDetails.details.email}</span>
                    </div>
                    <div style={{marginBottom: "10px"}}>
                      <label>Address: </label>
                      <span>{empDetails.details.address}</span>
                    </div>
                  </div>
                  <div>
                    <div style={{marginBottom: "10px"}}>
                      <label>Job Location: </label>
                      <span>{empDetails.details.jobLocation}</span>
                    </div>
                    <div style={{marginBottom: "10px"}}>
                      <label>Role: </label>
                      <span>{empDetails.details.role}</span>
                    </div>
                    <div style={{marginBottom: "10px"}}>
                      <label>Department: </label>
                      <span>{empDetails.details.department}</span>
                    </div>
                    <div style={{marginBottom: "10px"}}>
                      <label>Manager: </label>
                      <span>{empDetails.details.managerName}</span>
                    </div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="2">
                <div>
                  <ol>
                    {empDetails.details.goals.map((goal, index) => {
                      return (
                        <li key={index}>
                          <div style={{marginBottom: "10px"}}>
                            <label>Goal: </label>
                            <span>{goal.goal}</span>
                          </div>
                          <div style={{marginBottom: "10px"}}>
                            {!edit ? 
                              <label>Status: {goal.status}<span>%</span></label>
                              :
                              <input style={{width: "50px"}} type="number" value={goal.status} min={0} onChange={(e) => editGoalValue(e, index)}/>
                            }
                            <Box sx={{ width: '100%' }}>
                            <LinearProgress variant="determinate" value={Number(goal.status)} />
                          </Box>
                          </div>
                        </li>
                      );
                    })}  
                  </ol>
                  <div>
                    <Button style={{width: '100px'}} onClick={handleEdit}>Edit goal</Button>&nbsp;
                    <Button style={{width: '100px'}} onClick={handleCancel}>Cancel</Button>
                  </div>
                  <div style={{display: "flex", justifyContent: 'end'}}>
                    <Button onClick={handleSubmit} style={{width: '100px'}}>Submit</Button>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="3">
                <ol>
                  {empDetails.details.feedback.map((feedback, index) => {
                    return (
                      <li key={index}>
                        <div style={{marginBottom: "10px"}}>
                          <span>{feedback.text}</span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </TabPanel>
            </TabContext>
          </Box>
        </>
      }
    </div>
  );
};

export default EmployeeDashboard;