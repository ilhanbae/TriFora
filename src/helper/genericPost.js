/* This method serves as a generic API POST handler; it takes in API endpoint 
and body, and returns response data and error message. */
export default async function genericPost(endpoint, body) {
  // Set Base API Variables
  const method = "POST";
  const baseUrl = `${process.env.REACT_APP_API_PATH}`;
  const requestUrl = `${baseUrl}${endpoint}`; // Full request url
  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + sessionStorage.getItem("token"),
  };
  // console.log(requestUrl);
  // console.log(body);

  // Payloads
  let data = null;
  let errorMessage = null;

  // Perform POST Request
  try {
    const response = await fetch(requestUrl, {
      method:  method,
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Handles error response: either the query was bad or auth token was invalid
      // console.log(`Error response: ${response.status} ${response.statusText}`)
      errorMessage = response.statusText;
    } else {
      // Handles ok response: both request endpoint & query were good
      // console.log("Ok response")
      data = await response.json();
    }
  } catch (error) {
    // Handles invalid request: the API endpoint doens't exist
    // console.log("Invalid request");
    errorMessage = error.message;
  }
  
  // console.log(data, errorMessage)
  return { data, errorMessage };
}
