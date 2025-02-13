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
import Rating from '@mui/material/Rating';

const ManagersDashboard = (props) => {

    const [value, setValue] = React.useState('1');
    const [empDetails, setEmpDetails] = React.useState("");
    const [goals, setGoals] = React.useState("");
    const [empEmailForGoals, setEmpEmailForGoals] = React.useState("");
    const [empEmailForFeedback, setEmpEmailForFeedback] = React.useState("");
    const [empEmailForTraining, setEmpEmailForTraining] = React.useState("");
    const [goalsValue, setGoalsValue] = React.useState("");
    const [kpiValue, setKpiValue] = React.useState("");
    const [kraValue, setKraValue] = React.useState("");
    const [feedbackValue, setFeedbackValue] = React.useState("");
    const [trainingValue, setTrainingValue] = React.useState("");
    const [ratingValue, setRatingValue] = React.useState(0);
    const [hover, setHover] = React.useState(-1);

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
        setEmpEmailForGoals(newValue);
    }

    const handleSelectChangeForFeedback = (e, newValue) => {
        console.log(newValue)
        setEmpEmailForFeedback(newValue);
    }

    const handleSelectChangeForTraining = (e, newValue) => {
        setEmpEmailForTraining(newValue);
    }

    const onGoalsChange = (e) => {
        setGoalsValue(e.target.value);
    }

    const onKpiChange = (e) => {
        setKpiValue(e.target.value);
    }

    const onKraChange = (e) => {
        setKraValue(e.target.value);
    }

    const onFeedbackChange = (e) => {
        setFeedbackValue(e.target.value);
    }

    const onAssignTrainingChange = (e) => {
        setTrainingValue(e.target.value);
    }

    const handleAssignGoal = () => {
        if(empEmailForGoals === "" || empEmailForGoals === null) {
            alert("Select employee");
            return;
        }
        if(goalsValue === "") {
            alert("Enter Goal");
            return;
        }

        if(kpiValue === "") {
            alert("Enter Kpi");
            return;
        }

        if(kraValue === "") {
            alert("Enter Kra");
            return;
        }

        const goal = {goal: goalsValue, status: 0, KPI: kpiValue, KRA: kraValue};

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
        const managersRating = {rating: String(ratingValue)}

        const updateFeedback = async (email, feedback) => {
            try {
                const response = await fetch(`http://localhost:3333/api/details/addFeedback/${email}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ feedback: feedback, managersRating: managersRating }),
                });
                const data = await response.json();
                if(data.status === '200') {
                    alert('Feedback updated successfully');
                    setEmpEmailForFeedback("");
                    setFeedbackValue("");
                    setRatingValue(0);
                }
            } catch (error) {
                console.error('Error updating Feedback:', error);
            }
        };
        updateFeedback(empEmailForFeedback, feedback);
    }

    const handleAssignTraining = () => {
        if(empEmailForTraining === "") {
            alert("Select employee");
            return;
        }

        if(trainingValue === "") {
            alert("Enter Training");
            return;
        }

        const training = {text: trainingValue};

        const updateTraining = async (email, training) => {
            try {
                const response = await fetch(`http://localhost:3333/api/details/addTraining/${email}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ training: training }),
                });
                const data = await response.json();
                if(data.status === '200') {
                    alert('Training updated successfully');
                    setEmpEmailForTraining("");
                    setTrainingValue("");
                }
            } catch (error) {
                console.error('Error updating Training:', error);
            }
        };
        updateTraining(empEmailForTraining, training);
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
                            <Tab label="List of employees" value="1" style={{width: "25%"}}/>
                            <Tab label="Assign Goals" value="2" style={{width: "25%"}}/>
                            <Tab label="Feedback" value="3" style={{width: "25%"}}/>
                            <Tab label="Assign Trainings" value="4" style={{width: "25%"}}/>
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
                                            <TableCell style={{paddingLeft: "40px"}}>Competencies</TableCell>
                                            <TableCell>Customer's Rating</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {empDetails && empDetails.length && empDetails.map((row, index) => (
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
                                            <TableCell>{row.experience}</TableCell>
                                            <TableCell>
                                                <ol>
                                                    {row.Competencies.map((competency, index) => {
                                                        return <li key={index}>{competency.text}</li>
                                                    })}
                                                </ol>
                                            </TableCell>
                                            <TableCell>
                                                <Rating
                                                    precision={0.5}
                                                    readOnly
                                                    value={Number(row.CustomerRating[0].rating)}
                                                />
                                            </TableCell>
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
                                <Textarea minRows={2} value={goalsValue} placeholder="Assign Goal…" onChange={onGoalsChange}/>
                                <br/><br/>
                                <Textarea minRows={2} value={kpiValue} placeholder="Assign KPI" onChange={onKpiChange}/>
                                <br/><br/>
                                <Textarea minRows={2} value={kraValue} placeholder="Assign KRA" onChange={onKraChange}/>
                                <br/><br/>
                                <Button style={{width: "150px"}} onClick={handleAssignGoal}>Assign Goal</Button>
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
                                <Textarea minRows={2} placeholder="Write your feedback…" value={feedbackValue} onChange={onFeedbackChange}/>
                                <br/><br/>
                                <Rating
                                    name="hover-feedback"
                                    value={ratingValue}
                                    precision={0.5}
                                    onChange={(event, newValue) => {
                                        setRatingValue(newValue);
                                    }}
                                    onChangeActive={(event, newHover) => {
                                        setHover(newHover);
                                    }}
                                />
                                <br/><br/>
                                <Button style={{width: "100px"}} onClick={handleGiveFeedback}>Send Feedback</Button>
                            </div>
                        </TabPanel>
                        <TabPanel value="4">
                            <div>
                                <label>Select Employee to assign Trainings:</label>
                                <div style={{width: "400px"}}>
                                    <Select value={empEmailForTraining} onChange={handleSelectChangeForTraining}>
                                        { 
                                            empDetails && empDetails.length && empDetails.map((emp, index) => (
                                                <Option key={index} value={emp.email}>{emp.name}</Option>
                                            ))
                                        }
                                    </Select>
                                </div>
                                <br/><br/>
                                <Textarea minRows={2} placeholder="Assign Training..." value={trainingValue} onChange={onAssignTrainingChange}/>
                                <br/><br/>
                                <Button style={{width: "100px"}} onClick={handleAssignTraining}>Send Feedback</Button>
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
                                <br/>
                                <label>KPI: </label>
                                <span>{goal.KPI}</span>
                                <br/>
                                <label>KRA: </label>
                                <span>{goal.KRA}</span>
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