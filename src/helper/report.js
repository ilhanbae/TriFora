import genericFetch from "./genericFetch";

// const getPostId = async () => {
//     let endpoint = "/posts";
//     let query = {
//         sort: "newest",
//         parentID: "",
//         recipientGroupID: props.communityId,
//         ...(props.communityPostSkipOffset && { skip: props.communityPostSkipOffset }),
//         ...(props.communityPostTakeCount && { take: props.communityPostTakeCount })
//     };
//     const { data, errorMessage } = await genericFetch(endpoint, query);
//
//     for (let i = 0; i < data[0].length; i++) {
//         console.log(data[0][i])
//     }
//
// }

export default function report(postId) {
    // Get the ID of the post that the user is reacting to
    // const postId = getPostId();

    const authToken = sessionStorage.getItem("token");
    console.log(authToken);
    console.log(sessionStorage)
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
                alert('Post Reported!');
            } else {
                // There was an error adding the reaction
                alert('Login first');
            }
        })
        .catch(error => {
            console.error(error);
            alert('Error reporting');
        });
}
