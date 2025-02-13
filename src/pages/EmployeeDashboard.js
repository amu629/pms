import React, { useEffect, useRef } from "react";
import "./EmployeeDashboard.css";
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import {TabList, TabPanel, TabContext} from '@mui/lab';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import {Button} from '@mui/joy';


const EmployeeDashboard = (props) => {
  const [value, setValue] = React.useState('1');
  const [edit, setEdit] = React.useState(false);
  const [empDetails, setEmpDetails] = React.useState(null);
  const [topPerformer, setTopPerformer] = React.useState({name: "", rating: ""});
  const empDetailsRef = useRef(props);

  useEffect(() => {
    setEmpDetails(props)
  }, [props]);

  useEffect(() => {
    const getTopPerformer = async() => {
      const response = await fetch(`http://localhost:3333/api/highest-rated-employee`);
      const data = await response.json();
      setTopPerformer(data);
    }
    getTopPerformer();
  }, [])
  
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
            <br/>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly"}}>
              <div>
                <Typography>Customer Raiting</Typography>
                <Rating
                  precision={0.5}
                  readOnly
                  value={Number(empDetails.details.CustomerRating[0].rating)}
                />
              </div>
              <div>
                <Typography>Manager's Raiting</Typography>
                <Rating
                  precision={0.5}
                  readOnly
                  value={Number(empDetails.details.ManagersOverallRating[0].rating)}
                />
              </div>
              <div>
                <Typography>Incentives</Typography>
                <label>₹{empDetails.details.Incentives[0].text}</label>
              </div>
              <div>
                <Typography>Top Performer</Typography>
                {topPerformer.name !== "" && 
                  <>
                    <Rating
                      precision={0.5}
                      readOnly
                      value={Number(topPerformer[0].CustomerRating[0].rating)}
                    />
                    <Box sx={{ ml: 2 }}>{topPerformer[0].name}</Box>
                  </>
                }
              </div>
            </div>
          </div>
          <br/><br/><br/><br/>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'bisque', width: "100%" }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="Employee Details" value="1" style={{width: "25%"}}/>
                  <Tab label="Goals" value="2" style={{width: "25%"}}/>
                  <Tab label="Feedback" value="3" style={{width: "25%"}}/>
                  <Tab label="Trainings" value="4" style={{width: "25%"}}/>
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
                            <br/>
                            <label>KPI: </label>
                            <span>{goal.KPI}</span>
                            <br/>
                            <label>KRA: </label>
                            <span>{goal.KRA}</span>
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
              <TabPanel value="4">
                <label>Trainings Suggested</label>
                <ol>
                  {empDetails.details.TrainingSuggested.map((trainings, index) => {
                    return (
                      <li key={index}>
                        <div style={{marginBottom: "10px"}}>
                          <span>{trainings.text}</span>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <br/><br/>

                <label>Trainings Completed</label>
                <ol>
                  {empDetails.details.TrainingsReceived.map((trainings, index) => {
                    return (
                      <li key={index}>
                        <div style={{marginBottom: "10px"}}>
                          <span>{trainings.text}</span>
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