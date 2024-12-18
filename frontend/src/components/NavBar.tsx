import React from 'react';
import logo from "../assets/logo.svg";
import { LogOut, MusicDoubleNote } from "iconoir-react";
import defaultAvatar from "../assets/imgs/avatars/default-avatar.png";
import { useNavigate } from "react-router-dom";
import {UseNavBar} from "./UseNavBar";

interface NavBarProps {
    highlighted: string;
}

const NavBar: React.FC<NavBarProps> = ({ highlighted }) => {
    const { logout } = UseNavBar();
    const navigate = useNavigate();

    const handleLogout = async () => {
        logout();
        navigate("/login");
    };

    return (
        <nav>
            <a href="/"><img src={logo} alt="SoundSpotlight Logo" /></a>
            <div className={"menuArea flexRow"}>
                <div className={"menuOptions flexRow columnGap32"}>
                    <a className={highlighted === 'home' ? "active" : ""} href="./dashboard">Home</a>
                    <a className={highlighted === 'topAlbums' ? "active" : ""} href="./topAlbums">Top albums</a>
                    <a className={highlighted === 'yourFavorites' ? "active" : ""} href="./yourFavorites">Your favorites</a>
                    <a className={highlighted === 'adminConsole' ? "active" : ""} href="./adminConsole">Admin console</a>
                </div>
                <div className={"userSide flexRow columnGap24"}>
                    <button className={"flexRow columnGap8"}>
                        <span className={"iconBox flexCenter"}>
                            <MusicDoubleNote color="#4CA6A8" width={20} height={20} />
                        </span>
                        <a href="./addAlbum">Add album</a>
                    </button>
                    <span className={"menuDivider"}></span>
                    <div className={"userInfo flexRow columnGap16"}>
                        <a href="./myProfile" className={"profile flexRow columnGap8"}>
                            <img className={"standardAvatar"} src={defaultAvatar} alt="User avatar" />
                            <p className={"fontMedium"}>User name</p>
                        </a>
                        <button className={"flexRow"} onClick={handleLogout} type="button">
                            <LogOut color="#70758F" width={24} height={24} />
                        </button>
                    </div>
                </div>
            </div>

            <div className={"hamburgerMenu"}>
                <span className={"hamburgerBar"}></span>
                <span className={"hamburgerBar"}></span>
                <span className={"hamburgerBar"}></span>
            </div>
        </nav>
    );
};

export default NavBar;