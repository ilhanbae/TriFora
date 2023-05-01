import React, { useState } from "react";
import group from "../assets/group.png";

export default function CreateCommunity() {
    const [communityName, setCommunityName] = useState();
    const [communityImage, setCommunityImage] = useState();

    // Update community name from input
    const communityNameInput = (e) => {
        setCommunityName(e.target.value);
    };

    // Update community name from input
    const communityImageHandler = (e) => {
        setCommunityImage(e.target.value);
    };

    return (
        <div>
            <div>
                <form>
                    <div>
                        <label>
                            <h1>Name of your community:</h1>
                            <input
                                type="text"
                                onChange={communityNameInput}
                                autoFocus
                                required
                                // below is field check error message since required field
                                onInvalid={e => e.target.setCustomValidity("Community requires a name")}
                                onInput={e => e.target.setCustomValidity("")} // not sure if this is needed
                            />
                        </label>
                    </div>
                    <br />
                    <div>
                        <label>
                            <h1>Community image:</h1>
                            <input
                                type="file"
                                accept="image/png, image/jpg, image/jpeg"
                                onChange={communityImageHandler}
                                hidden//={this.state.postImages.length < 1}
                                required
                            />
                            {communityImage > 0 &&
                                <img
                                    src={URL.createObjectURL(communityImage)}
                                    className="upload-image"
                                    alt="Community image"
                                    title="Community image" />
                            }
                            <img
                                src={group}
                                className="upload-image"
                                alt="Community image"
                                title="Community image" />
                        </label>
                    </div>
                    <br />
                    <label>
                        <input className="create-community-button" type="submit" value="Create community" />
                    </label>
                    <br />
                </form>
            </div>
        </div>
    )
}