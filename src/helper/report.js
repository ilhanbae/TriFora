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

function report(postId) {
    // Get the ID of the post that the user is reacting to
    // const postId = getPostId();

    const authToken = sessionStorage.getItem("token");
    // Make a request to the /post-reactions endpoint to add a "like" reaction
    fetch('/post-reactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
            post_id: postId,
            reactorID: sessionStorage.getItem("user"),
            name: 'report',
        })
    })
        .then(response => {
            if (response.ok) {
                // The reaction was added successfully
                alert('Post Reported!');
            } else {
                // There was an error adding the reaction
                alert('Error reporting, try again!');
            }
        })
        .catch(error => {
            console.error(error);
            alert('Error reporting!');
        });
}
