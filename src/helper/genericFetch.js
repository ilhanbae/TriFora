/* This method serves as a generic API GET handler; it takes in API endpoint 
and params (query), and returns fetched data or erorr message. 
Note: the 'HCI-Social API' behaves as following:
- On valid request, the API responds with: [list of data, length of data list]
- on query error, the API responds with error message {query: [{keyword, message}]}
- On invalid request, the API responds with error message {""}
*/
export default async function genericFetch(endpoint, query) {
  // Base API Variables
  const baseUrl = `${process.env.REACT_APP_API_PATH}`;
  const queryParams = new URLSearchParams(query);
  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + sessionStorage.getItem("token"),
  };
  const requestUrl = `${baseUrl}${endpoint}?${queryParams}`; // Full request url

  // Payloads
  let data = null;
  let errorMessage = null;

  // Perform fetch
  try {
    let response = await fetch(requestUrl, headers);
    let responseData = await response.json();
    if (responseData.query) {
      // handles invalid query: query endpoint doensn't exist or query value is bad
      // console.log("Bad Query");
      errorMessage = "Bad Query";
    } else {
      // handles valid request: both request url and query is good
      // console.log("Valid Requst");
      if (Array.isArray(responseData)) {
        // Response data is list
        data = responseData[0];
      } else {
        // Respones data is single object
        data = responseData
      }
      // console.log(typeof responseData);
    }
  } catch (error) {
    // console.log(error);
    // handles invalid request: API endpoint doesn't exist
    // console.log("Invalid request");
    errorMessage = error;
  }

  return { data, errorMessage };
}