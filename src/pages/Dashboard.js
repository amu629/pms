import React, { useEffect, useState } from "react";
import EmployeeDashboard from "./EmployeeDashboard";
import ManagersDashboard from "./ManagersDashboard";
import HrDashboard from "./HrDashboard";

const Dashboard = () => {
  const [details, setDetails] = useState("");

  const getDetails = async(apiEntity ,token) => { 
    const response = await fetch('http://localhost:3333/api/'+apiEntity+'/'+token, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data);
    setDetails(data);
    return data;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token === 'employee@example.com') {
      getDetails('details',token);
    } else if(token === 'manager@example.com'){
      getDetails('managers',token);
    }
  }, []);

  return (
    <div>
      {details.email === "employee@example.com"  && (
            <div>
              <EmployeeDashboard details={details}/>
            </div>
      )}
      {details.email === "manager@example.com" && (
        <div>
          <ManagersDashboard details={details}/>
        </div>
      )}
      {details.email === "hr@example.com" && (
        <div>
          <HrDashboard details={details}/>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
