export default function report(postId) {
    // Get the ID of the post that the user is reacting to
    // const postId = getPostId();

    const authToken = sessionStorage.getItem("token");
    // console.log(authToken);
    // console.log(sessionStorage)
    // Make a request to the /post-reactions endpoint to add a "like" reaction
    // https://webdev.cse.buffalo.edu/hci/api/api/underachievers/users/216?relatedObjectsAction=delete

    const baseUrl = `${process.env.REACT_APP_API_PATH}`;
    const endpoint = "/post-reactions"

    const url = `${baseUrl}${endpoint}`;
    console.log(url);

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
            postID: postId,
            reactorID: sessionStorage.getItem("user"),
            name: 'report',
            value: 1
        })
    };

    fetch(url, requestOptions)
        .then(response => {
            if (response.ok) {
                // The reaction was added successfully
                // alert('Post Reported!');
            } else {
                // There was an error adding the reaction
                // alert('Login first');
            }
        })
        .catch(error => {
            console.error(error);
            alert('Error reporting');
        });
}
