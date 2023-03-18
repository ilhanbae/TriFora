/* This method serves as generic upload file API request handler; it takes in FormData
params: UploaderID, attributes, and file. The uploaderID is same as user's id, and the 
attributes can include custom flags, like "user-avatar".
>  "uploaderID": "105"
>  "attributes": "{"type": "user-avatar"}""
>  "file": "{}"
*/
export default async function uploadFile(formDataParams) {
  // Set Base API Variables
  const method = "POST";
  const baseUrl = `${process.env.REACT_APP_API_PATH}`;
  const endpoint = "/file-uploads";
  const requestUrl = `${baseUrl}${endpoint}`; // Full request url
  const headers = {
    "Authorization": "Bearer " + sessionStorage.getItem("token"),
    // 'Content-Type': "multipart/form-data",
  };

  // Payloads
  let data = null;
  let errorMessage = null;

  // Set Form Data
  const formData = new FormData();
  formData.append("uploaderID", formDataParams.uploaderID);
  formData.append("attributes", JSON.stringify(formDataParams.attributes));
  formData.append("file", formDataParams.file);

  // console.log(formDataParams.uploaderID);
  // console.log(JSON.stringify(formDataParams.attributes));
  // console.log(formDataParams.file);

  // Perform request
  try {
    const response = await fetch(requestUrl, {
      method:  method,
      headers: headers,
      body: formData,
    });
    // console.log(response);
    data = await response.json();
    // console.log(data);
  } catch (error) {
    errorMessage = error;
  }

  return { data, errorMessage };
}
