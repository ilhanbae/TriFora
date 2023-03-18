/* This method serves as generic API PATCH handler; */
export default async function genericPatch(endpoint, body) {
  // Set Base API Variables
  const method = "PATCH";
  const baseUrl = `${process.env.REACT_APP_API_PATH}`;
  const requestUrl = `${baseUrl}${endpoint}`; // Full request url
  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + sessionStorage.getItem("token"),
    
  };

  // Payloads
  let data = null;
  let errorMessage = null;

  console.log(body);

  // Perform request
  try {
    const response = await fetch(requestUrl, {
      method:  method,
      headers: headers,
      body: JSON.stringify(body),
    });
    // console.log(response);
    data = await response.json();
    // console.log(data);
  } catch (error) {
    errorMessage = error;
  }

  return { data, errorMessage };
}
