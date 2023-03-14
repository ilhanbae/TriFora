/* This method serves as a generic API fetch handler; it takes in API endpoint 
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
  const sampleLoginToken =
    "underachievers|-qQJ4JCVxvEbpHKyRUklJCqKZ5Gdm1evrekBkdvFjBw"; // placeholder
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + sampleLoginToken,
    // "Authorization": "Bearer " + sessionStorage.getItem("token"),
  };
  const requestUrl = `${baseUrl}${endpoint}?${queryParams}`; // Full request url
  // console.log(requestUrl);

  // Payloads
  let data = null;
  let errorMessage = null;

  // Perform fetch
  try {
    let response = await fetch(requestUrl, headers);
    let responesData = await response.json();
    if (responesData.query) {
      // handles invalid query: query endpoint doensn't exist or query value is bad
      // console.log("Bad Query");
      errorMessage = "Bad Query";
    } else {
      // handles valid request: both request url and query is good
      // console.log("Valid Requst");
      data = responesData[0];
      // console.log(responesData);
    }
  } catch (error) {
    console.log(error);
    // handles invalid request: API endpoint doesn't exist
    // console.log("Invalid request");
    errorMessage = error;
  }

  return { data, errorMessage };
}
