import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DropMenu.css"

export default function DropMenu() {
    const [dropped, setDrop] = useState(true);
    /* use a hook to show/hide the dropdown menu */

    return (
        /* by making the classname conditional the menu can be hidden via css
        and whenever a menu item is clicked the menu should also probably close after
        displaying the new page.
        */
        <ul className={dropped ? "showDrop" : "hideDrop"}>
            <li>
                <Link to="/profile" onClick={() => setDrop(!dropped)}> My Profile </Link>
            </li>
            <li>
                <Link to="/notifications" onClick={() => setDrop(!dropped)}> Notifications </Link>
            </li>
            <li>
                <p onClick={e => {
                    /* this is the only way I could think to do this for logout */
                    this.props.logout(e);
                    setDrop(!dropped);
                }}>
                    Logout
                </p>
            </li>
        </ul>
    );
}