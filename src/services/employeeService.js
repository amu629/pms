const API_URL = "http://localhost:8080/api/employees";

export const getEmployees = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};
