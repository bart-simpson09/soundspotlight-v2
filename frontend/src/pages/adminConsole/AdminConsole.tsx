import React, {useEffect, useState} from "react";
import NavBar from "../../components/navBar/NavBar";
import {AlbumList, Notes, UserCircle} from "iconoir-react";
import {useAdminConsole} from "./useAdminConsole";
import {Album} from "../../types/album";
import PendingAlbumTile from "../../components/adminConsole/PendingAlbumTile";
import {User} from "../../types";
import UserTile from "../../components/adminConsole/UserTile";
import {Review} from "../../types/review";
import PendingReviewTile from "../../components/adminConsole/PendingReviewTile";

export const AdminConsole: React.FC = () => {

    const [activeTab, setActiveTab] = useState("pendingReviews");
    const { albums, fetchData, modifyAlbumStatus, users, modifyUserRole, reviews, modifyReviewStatus } = useAdminConsole();
    const [finalAlbums, setAlbums] = useState<Album[] | undefined>(albums);
    const [finalUsers, setUsers] = useState<User[] | undefined>(users);
    const [finalReviews, setReviews] = useState<Review[] | undefined>(reviews);

    useEffect(() => {
        document.title = 'Admin console';
        document.body.classList.remove("singleFormBody");
        fetchData();
    }, []);

    useEffect(() => {
        setAlbums(albums);
        setUsers(users);
        setReviews(reviews);
    }, [albums, users, reviews]);



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
                        <AlbumList color={activeTab === "pendingAlbums" ? "#4CA6A8" : "#9195AA"}/>
                        Pending albums
                    </button>
                    <button
                        className={`tabItem flexRow columnGap8 ${activeTab === "manageUsers" ? "active" : ""}`}
                        onClick={() => handleTabClick("manageUsers")}>
                        <UserCircle color={activeTab === "manageUsers" ? "#4CA6A8" : "#9195AA"}/>
                        Manage users
                    </button>
                </div>
                <div>
                    <div id="pendingReviews" className="tabContent flexColumn rowGap16"
                         style={{display: activeTab === "pendingReviews" ? 'block' : 'none'}}>
                        {finalReviews && finalReviews.length > 0 ? (
                            finalReviews.map((review) => (
                                <PendingReviewTile
                                    key={review.id}
                                    id={review.id}
                                    rate={review.rate.toString()}
                                    content={review.content}
                                    albumTitle={review.album.albumTitle}
                                    albumAuthorName={review.album.author.name}
                                    reviewAuthorFirstName={review.author.firstName}
                                    reviewAuthorLastName={review.author.lastName}
                                    onApprove={() => modifyReviewStatus(review.id, "approve")}
                                    onDecline={() => modifyReviewStatus(review.id, "decline")}
                                />
                            ))
                        ) : (
                            <p>There are no pending reviews at the moment.</p>
                        )}
                    </div>
                    <div id="pendingAlbums" className="tabContent flexColumn rowGap16"
                         style={{display: activeTab === "pendingAlbums" ? 'block' : 'none'}}>
                        {finalAlbums && finalAlbums.length > 0 ? (
                            finalAlbums.map((album) => (
                                <PendingAlbumTile
                                    key={album.id}
                                    id={album.id}
                                    coverImage={album.coverImageURL}
                                    title={album.albumTitle}
                                    author={album.author.name}
                                    releaseDate={album.releaseDate.toString()}
                                    category={album.category.name}
                                    language={album.language.name}
                                    description={album.description}
                                    addedBy={`${album.addedBy.firstName} ${album.addedBy.lastName}`}
                                    onApprove={() => modifyAlbumStatus(album.id, "approve")}
                                    onDecline={() => modifyAlbumStatus(album.id, "decline")}
                                />
                            ))
                        ) : (
                            <p>There are no pending albums at the moment.</p>
                        )}
                    </div>
                    <div id="manageUsers" className="tabContent flexColumn rowGap16"
                         style={{display: activeTab === "manageUsers" ? 'block' : 'none'}}>
                        {finalUsers && finalUsers.length > 0 && (
                            finalUsers.map((user) => (
                                <UserTile
                                    key={user.id}
                                    id={user.id}
                                    avatar={user.avatar}
                                    firstName={user.firstName}
                                    lastName={user.lastName}
                                    email={user.email}
                                    role={user.role}
                                    currentUserId={sessionStorage.getItem("current_user_id") || ""}
                                    revokeAdmin={() => modifyUserRole(user.id, "revoke")}
                                    grantAdmin={() => modifyUserRole(user.id, "grant")}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
        ;
};