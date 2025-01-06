import React, {useEffect, useState} from "react";
import NavBar from "../../components/navBar/NavBar";
import {Album, Notes, StarSolid, User, UserCrown} from "iconoir-react";

export const AdminConsole: React.FC = () => {

    const [activeTab, setActiveTab] = useState("pendingReviews");

    useEffect(() => {
        document.title = 'Admin console';
        document.body.classList.remove("singleFormBody");
    }, []);

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
    };

    return (

    <div>
        <NavBar highlighted="adminConsole" />

        <div className="globalPageContainer flexColumn rowGap32 narrowPageContainer">
            <h1>Admin console</h1>
            <div className="flexColumn rowGap24">
                <div className="flexRow columnGap16 rowGap8 mobileWrapped">
                    <button
                        className={`tabItem flexRow columnGap8 ${activeTab === "pendingReviews" ? "active" : ""}`}
                        onClick={() => handleTabClick("pendingReviews")}>
                        <Notes color={activeTab === "pendingReviews" ? "#4CA6A8" : "#9195AA"} />
                        Pending reviews
                    </button>
                    <button
                        className={`tabItem flexRow columnGap8 ${activeTab === "pendingAlbums" ? "active" : ""}`}
                        onClick={() => handleTabClick("pendingAlbums")}>
                        <Album color={activeTab === "pendingAlbums" ? "#4CA6A8" : "#9195AA"}/>
                        Pending albums
                    </button>
                    <button
                        className={`tabItem flexRow columnGap8 ${activeTab === "manageUsers" ? "active" : ""}`}
                        onClick={() => handleTabClick("manageUsers")}>
                        <User color={activeTab === "manageUsers" ? "#4CA6A8" : "#9195AA"}/>
                        Manage users
                    </button>
                </div>
                <div>
                    <div id="pendingReviews" className="tabContent flexColumn rowGap16"
                         style={{display: activeTab === "pendingReviews" ? 'block' : 'none'}}>
                        <div className="yourProfileItem flexColumn rowGap16">
                            <div className="flexRow yourProfileItemHeader">
                                <div className="flexColumn rowGap4">
                                    <h4>Album name</h4>
                                    <h5>Album author name</h5>
                                </div>
                                <div className="flexRow columnGap16">
                                    <div className="flexRow columnGap8 opinionRate">
                                        <StarSolid/>
                                        X/5
                                    </div>
                                    <div className="flexRow columnGap8">
                                        <button className="buttonOutlined positiveAction">Approve</button>
                                        <button className="buttonOutlined importantAction">Decline</button>
                                    </div>
                                </div>
                            </div>
                            <p>Review content</p>
                            <span className="pendingDivider"></span>
                            <div className="flexRow columnGap8">
                                <h5>Added by:</h5>
                                <p>Review author first and last name</p>
                            </div>
                        </div>

                        <p>There are no pending reviews at the moment.</p>

                    </div>
                    <div id="pendingAlbums" className="tabContent flexColumn rowGap16"
                         style={{display: activeTab === "pendingAlbums" ? 'block' : 'none'}}>
                        <div className="yourProfileItem flexRow columnGap16">
                            <img src="/public/assets/imgs/covers/<?= $pendingAlbum['cover'] ?>"
                                 className="albumSmallCover"
                                 alt=""/>
                            <div className="flexColumn rowGap16" style={{width: '100%'}}>
                                <div className="flexRow yourProfileItemHeader">
                                    <div className="flexColumn rowGap4">
                                        <h4>Pending album title</h4>
                                        <h5>Pending album author</h5>
                                    </div>
                                    <div className="flexRow columnGap8">
                                        <button className="buttonOutlined positiveAction">Approve</button>
                                        <button className="buttonOutlined importantAction">Decline</button>
                                    </div>
                                </div>
                                <span className="dividerHorizon40"></span>
                                <div className="flexColumn rowGap8">
                                    <div className="flexRow columnGap32 flexWrap">
                                        <div className="flexRow columnGap8">
                                            <h5>Category:</h5>
                                            <p>category name</p>
                                        </div>
                                        <div className="flexRow columnGap8">
                                            <h5>Language:</h5>
                                            <p>language name</p>
                                        </div>
                                        <div className="flexRow columnGap8">
                                            <h5>Release date:</h5>
                                            <p>release date</p>
                                        </div>
                                    </div>
                                    <p className="shortAlbumDescription">description</p>
                                    <span className="pendingDivider"></span>
                                    <div className="flexRow columnGap8">
                                        <h5>Added by:</h5>
                                        <p>Added by first name and last name</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p>There are no pending albums at the moment.</p>
                    </div>
                    <div id="manageUsers" className="tabContent flexColumn rowGap16"
                         style={{display: activeTab === "manageUsers" ? 'block' : 'none'}}>
                        <div className="yourProfileItem flexRow yourProfileItemHeader">
                            <div className="flexRow columnGap16">
                                <img className="standardAvatar" src="/public/assets/imgs/avatars/<?= $user['avatar'] ?>"
                                     alt=""/>
                                <div className="flexColumn">
                                    <div className="flexRow columnGap4" id="userNameSection">
                                        <h4>user fist and last name</h4>
                                        <UserCrown color={"#4CA6A8"}/>
                                        <i className="iconoir-user-crown"></i>
                                    </div>
                                    <h5>user email</h5>
                                </div>
                            </div>
                            <div className="flexRow columnGap8">
                                <button className="buttonOutlined">Revoke admin role</button>
                                <button className="buttonOutlined">Grant admin role</button>
                                <button className="buttonOutlined importantAction"></button>
                                <h5>This is your account</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
        ;
};