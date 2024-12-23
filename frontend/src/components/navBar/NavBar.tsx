import React, {useEffect, useState} from 'react';
import logo from "../../assets/logo.svg";
import { LogOut, MusicDoubleNote } from "iconoir-react";
import { useNavigate } from "react-router-dom";
import { UseNavBar } from "./UseNavBar";

interface NavBarProps {
    highlighted: string;
}

const NavBar: React.FC<NavBarProps> = ({ highlighted }) => {
    const { logout, user } = UseNavBar();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    if (!user) {
        return <></>;
    }

    return (
        <nav className={menuOpen ? "active" : ""}>
            <a href="/dashboard"><img src={logo} alt="SoundSpotlight Logo" /></a>

            <div className={`menuArea flexRow ${menuOpen ? "active" : ""}`}>
                <div className={"menuOptions flexRow columnGap32"}>
                    <a className={highlighted === 'home' ? "active" : ""} href="./dashboard">Home</a>
                    <a className={highlighted === 'topAlbums' ? "active" : ""} href="./topAlbums">Top albums</a>
                    <a className={highlighted === 'yourFavorites' ? "active" : ""} href="./yourFavorites">Your favorites</a>
                    {user.role === 'admin' && (
                        <a className={highlighted === 'adminConsole' ? "active" : ""} href="./adminConsole">Admin console</a>
                    )}
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
                            <img className={"standardAvatar"} src={user.avatar} alt="User avatar" />
                            <p className={"fontMedium"}>{user.firstName + ' ' + user.lastName}</p>
                        </a>
                        <button className={"flexRow"} onClick={logout} type="button">
                            <LogOut color="#70758F" width={24} height={24} />
                        </button>
                    </div>
                </div>
            </div>

            <div className={"hamburgerMenu"} onClick={toggleMenu}>
                <span className={"hamburgerBar"}></span>
                <span className={"hamburgerBar"}></span>
                <span className={"hamburgerBar"}></span>
            </div>
        </nav>
    );
};

export default NavBar;