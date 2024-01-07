import axios from "axios";
import { Navbar, NavbarBrand, Nav, Button } from 'reactstrap'
import { API_URL } from "../index.js";

export default function Header(props) {
    let isLoggedIn = props.isLoggedIn;
    let setIsLoggedIn = props.setIsLoggedIn;

    const handleLogout = e => {
        axios.post(API_URL + '/logout',)
        localStorage.clear()
        window.location.href = '/';
        setIsLoggedIn(false);
    }

    return(
        <div>
            <Navbar color="light" light expand='md'>
                <NavbarBrand className="m-auto">FastTracker Repository</NavbarBrand>
                <Nav navbar>
                    { isLoggedIn? <Button onClick={handleLogout}>Выйти</Button>: null }
                </Nav>
            </Navbar>
        </div>
    )
}