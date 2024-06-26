import React from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import styles from "../styles/NavBar.module.css";
import logo from '../assets/logo_ttt.PNG'
import { NavLink } from 'react-router-dom';
import {
    useCurrentUser,
    useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from 'axios';
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";
import { removeTokenTimestamp } from '../utils/utils';

// Credit to Code Institute Moments Walkthrough for structure of NavBar component 
const NavBar = () => {

    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();

    const { expanded, setExpanded, ref } = useClickOutsideToggle();

    const handleSignOut = async () => {
        try {
            await axios.post("dj-rest-auth/logout/");
            setCurrentUser(null);
            removeTokenTimestamp()
        } catch (err) {
        }
    };

    const addReview = (
        <NavLink
            className={` mr-4 ${styles.NavLink}`}
            activeClassName={styles.Active}
            to="/reviews/create"
        > <i class="fa-solid fa-pencil"></i> Create Review
        </NavLink>
    )

    const loggedInNavbarIcons = (
        <>

            <NavLink
                className={styles.NavLink}
                activeClassName={styles.Active}
                to="/saved"
            >Saved
            </NavLink>

            <NavLink
                className={styles.NavLink}
                activeClassName={styles.Active}
                to="/wishlist"
            >Wishlist
            </NavLink>

            <NavLink
                className={styles.NavLink}
                to="/"
                onClick={handleSignOut}
            >
                Sign out
            </NavLink>

            <NavLink
                className={`${styles.Profile} ${styles.NavLink} `}

                to={`/profiles/${currentUser?.profile_id}`}
            >
                <Avatar src={currentUser?.profile_image} text="Profile" height={40} />
            </NavLink>
        </>
    )

    const loggedOutNavbarIcons = (
        <>
            <NavLink
                className={styles.NavLink}
                activeClassName={styles.Active}
                to="/signin"
            >
                Sign in
            </NavLink>
            <NavLink
                className={styles.NavLink}
                activeClassName={styles.Active}
                to="/signup">
                Sign up
            </NavLink>
        </>
    )

    return (
        <Container>
            <Navbar expanded={expanded}
                expand="lg"
                fixed="top"
                className={`${styles.NavBar}`}
            >

                <NavLink className={`${styles.NavLogo}`} to="/">

                    <Image
                        roundedCircle
                        src={logo}
                        alt='logo'
                        height='40'
                    />
                    <Navbar.Brand className={`pl-2 m-auto ${styles.NavLogoText}`}>TableTopTales</Navbar.Brand>

                </NavLink>

                <Navbar.Toggle
                    ref={ref}
                    onClick={() => setExpanded(!expanded)}
                    aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className={styles.NavBarCollapsed} id="basic-navbar-nav">
                    <Nav className="mr-auto text-left">
                        <NavLink
                            exact
                            className={styles.NavLink}
                            activeClassName={styles.Active}
                            to="/"
                        > Home
                        </NavLink>
                        {currentUser ? loggedInNavbarIcons : loggedOutNavbarIcons}
                    </Nav>
                    {currentUser && addReview}
                </Navbar.Collapse>

            </Navbar>
        </Container>
    );
};

export default NavBar;