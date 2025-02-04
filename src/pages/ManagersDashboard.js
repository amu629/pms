import React, { useEffect } from 'react';
import './ManagersDashboard.css'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { deepOrange } from '@mui/material/colors';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {TabList, TabPanel, TabContext} from '@mui/lab';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Link from '@mui/material/Link';
import LinearProgress from '@mui/material/LinearProgress';
import {Textarea, Select, Option, Button} from '@mui/joy';

const ManagersDashboard = (props) => {

    const [value, setValue] = React.useState('1');
    const [empDetails, setEmpDetails] = React.useState("");
    const [goals, setGoals] = React.useState("");
    const [empEmailForGoals, setEmpEmailForGoals] = React.useState("");
    const [empEmailForFeedback, setEmpEmailForFeedback] = React.useState("");
    const [goalsValue, setGoalsValue] = React.useState("");
    const [feedbackValue, setFeedbackValue] = React.useState("");

    useEffect(() => {
        const fetchEmployeeDetail = async() => {
            const response = await fetch('http://localhost:3333/api/details', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              const data = await response.json();
              console.log(data);
              setEmpDetails(data);
        }
        fetchEmployeeDetail();
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    const handleSelectChangeForGoal = (e, newValue) => {
        console.log(newValue)
        setEmpEmailForGoals(newValue)
    }

    const handleSelectChangeForFeedback = (e, newValue) => {
        console.log(newValue)
        setEmpEmailForFeedback(newValue)
    }

    const onGoalsChange = (e) => {
        setGoalsValue(e.target.value);
    }

    const onFeedbackChange = (e) => {
        setFeedbackValue(e.target.value);
    }

    const handleAssignGoal = () => {
        if(empEmailForGoals === "") {
            alert("Select employee");
            return;
        }
        if(goalsValue === "") {
            alert("Enter Goal");
            return;
        }

        const goal = {goal: goalsValue, status: 0};

        const updateGoals = async (email, goal) => {
            try {
                const response = await fetch(`http://localhost:3333/api/details/addGoals/${email}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ goals: goal }),
                });
                const data = await response.json();
                if(data.status === '200') {
                    alert('Goals updated successfully');
                    setEmpEmailForGoals("");
                    setGoalsValue("");
                }
            } catch (error) {
                console.error('Error updating goals:', error);
            }
        };
        updateGoals(empEmailForGoals, goal);
    }

    const handleGiveFeedback = () => {
        if(empEmailForFeedback === "") {
            alert("Select employee");
            return;
        }

        if(feedbackValue === "") {
            alert("Enter Feedback");
            return;
        }

        const feedback = {text: feedbackValue};

        const updateFeedback = async (email, feedback) => {
            try {
                const response = await fetch(`http://localhost:3333/api/details/addFeedback/${email}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ feedback: feedback }),
                });
                const data = await response.json();
                if(data.status === '200') {
                    alert('Feedback updated successfully');
                    setEmpEmailForFeedback("");
                    setFeedbackValue("");
                }
            } catch (error) {
                console.error('Error updating Feedback:', error);
            }
        };
        updateFeedback(empEmailForFeedback, feedback);
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event, email) => {
        const emp = empDetails.filter((emp) => {
            return emp.email === email;
        })[0];
        setGoals(emp.goals);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    
    return (
        <>
            <div className="managers-dashboard-container">
                <div>
                    <div style={{textAlign: "center"}}>
                        <h1>Manager's Dashboard</h1>
                    </div>
                    <div>
                        <Avatar sx={{ bgcolor: deepOrange[500] }}>{props.details.name.charAt(0)}</Avatar>
                        <h2 style={{color: "blueviolet"}}>{props.details.name}</h2>
                    </div>
                </div>
                <br></br>
                <br></br>
                <br></br>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'bisque' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="List of employees" value="1"/>
                            <Tab label="Assign Goals" value="2" />
                            <Tab label="Feedback" value="3"/>
                            </TabList>
                        </Box>

                        <TabPanel value="1">
                            <label>List of Employees ({props.details.employees.length})</label>
                            <br></br>
                            <br></br>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>S.No.</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Role</TableCell>
                                            <TableCell>Year of Experience</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {props.details.employees.map((row, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                            <TableCell>
                                                {index+1}
                                            </TableCell>
                                            <TableCell><Link onClick={(event) => handleClick(event, row.email)}>{row.name}</Link></TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>{row.role}</TableCell>
                                            <TableCell>{row.yoe} years</TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TabPanel>
                        <TabPanel value="2">
                            <div>
                                <label>Select Employee to assign goal:</label>
                                <div style={{width: "400px"}}>
                                    <Select value={empEmailForGoals} onChange={handleSelectChangeForGoal}>
                                        { 
                                            empDetails && empDetails.length && empDetails.map((emp, index) => (
                                                <Option key={index} value={emp.email}>{emp.name}</Option>
                                            ))
                                        }
                                    </Select>
                                </div>
                                <br/><br/>
                                <Textarea minRows={3} value={goalsValue} placeholder="Assign Goal…" onChange={onGoalsChange}/>
                                <br/><br/>
                                <Button style={{width: "100px"}} onClick={handleAssignGoal}>Assign Goal</Button>
                            </div>
                        </TabPanel>
                        <TabPanel value="3">
                            <div>
                                <label>Select Employee to give Feedback:</label>
                                <div style={{width: "400px"}}>
                                    <Select value={empEmailForFeedback} onChange={handleSelectChangeForFeedback}>
                                        { 
                                            empDetails && empDetails.length && empDetails.map((emp, index) => (
                                                <Option key={index} value={emp.email}>{emp.name}</Option>
                                            ))
                                        }
                                    </Select>
                                </div>
                                <br/><br/>
                                <Textarea minRows={3} placeholder="Write your feedback…" value={feedbackValue} onChange={onFeedbackChange}/>
                                <br/><br/>
                                <Button style={{width: "100px"}} onClick={handleGiveFeedback}>Send Feedback</Button>
                            </div>
                        </TabPanel>
                    </TabContext>
                </Box>
            </div>

            {/* Popover container */}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                style={{width: "500%"}}
            >
            <div style={{marginRight: '25px'}}>
                <ol>
                {
                    goals && goals.length && goals.map((goal, index) => {
                        return (
                            <li key={index}>
                            <div style={{marginBottom: "10px"}}>
                                <label>Goal: </label>
                                <span>{goal.goal}</span>
                            </div>
                            <div style={{marginBottom: "10px"}}>
                                <label>Status: {goal.status}</label>%
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress variant="determinate" value={Number(goal.status)} />
                                </Box>
                            </div>
                            </li>
                        );
                    })
                }
                </ol>
            </div>
        </Popover>
    </>
    )
}

export default ManagersDashboard;