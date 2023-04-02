/* This method serves as a generic API GET handler; it takes in API endpoint 
and params (query), and returns response data and error message. */
export default async function genericFetch(endpoint, query) {
  // Base API Variables
  const baseUrl = `${process.env.REACT_APP_API_PATH}`;
  const queryParams = new URLSearchParams(query);
  const requestUrl = `${baseUrl}${endpoint}?${queryParams}`; // Full request url
  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + sessionStorage.getItem("token"),
  };
  // console.log(requestUrl);

  // Payloads
  let data = null;
  let errorMessage = null;

  // Perform GET Request
  try {
    const response = await fetch(requestUrl, headers);

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
