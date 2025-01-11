import React, {useEffect, useState} from "react";
import NavBar from "../../components/navBar/NavBar";
import {Message, MusicDoubleNote} from "iconoir-react";
import {Album} from "../../types/album";
import {useMyProfile} from "./useMyProfile";
import {Review} from "../../types/review";
import UserAlbumTile from "../../components/myProfile/UserAlbumTile";
import UserReviewTile from "../../components/myProfile/UserReviewTile";

export const MyProfile: React.FC = () => {

    const [activeTab, setActiveTab] = useState("yourReviews");
    const { albums, fetchData, reviews, sessionManager, changePhoto } = useMyProfile();
    const [finalAlbums, setAlbums] = useState<Album[] | undefined>(albums);
    const [finalReviews, setReviews] = useState<Review[] | undefined>(reviews);
    const [userPhoto, setUserPhoto] = useState<File | null>(null);

    useEffect(() => {
        document.title = 'My profile';
        document.body.classList.remove("singleFormBody");
        fetchData();
    }, []);

    useEffect(() => {
        setAlbums(albums);
        setReviews(reviews);
    }, [albums, reviews]);

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = e.target;
        const file = fileInput.files?.[0] || null;
        setUserPhoto(file);

        if (file) {
            const formData = new FormData();
            formData.append("userPhoto", file);

            await changePhoto(formData);

            if (sessionManager.currentUser) {
                sessionManager.fetchUser(sessionManager.currentUser.id);
            }

            setUserPhoto(null);
            fileInput.value = "";
        }
    };

    return (
        <div>
            <NavBar highlighted="none"/>

            <div className="globalPageContainer flexColumn rowGap32 narrowPageContainer">
                <h1>My profile</h1>
                <div className="flexRow columnGap24">
                    <img className="myProfileAvatar" src={sessionManager.currentUser?.avatar} alt=""/>
                    <div className="flexRow columnGap16 rowGap8">
                        <h1 style={{textWrap: "nowrap"}}>Welcome, {sessionManager.currentUser?.firstName}</h1>
                        <form id="changeUserPhotoForm" method="POST" encType="multipart/form-data">
                            <input
                                type="file"
                                id="photoInput"
                                name="newPhoto"
                                accept="image/png, image/jpeg"
                                onChange={handlePhotoChange}
                            />
                        </form>

                    </div>
                </div>
                <div className="flexColumn rowGap24">
                    <div className="flexRow columnGap16">
                        <button
                            className={`tabItem flexRow columnGap8 ${activeTab === "yourReviews" ? "active" : ""}`}
                            onClick={() => handleTabClick("yourReviews")}>
                            <Message color={activeTab === "yourReviews" ? "#4CA6A8" : "#9195AA"}/>
                            Your reviews
                        </button>
                        <button
                            className={`tabItem flexRow columnGap8 ${activeTab === "addedAlbums" ? "active" : ""}`}
                            onClick={() => handleTabClick("addedAlbums")}>
                            <MusicDoubleNote color={activeTab === "addedAlbums" ? "#4CA6A8" : "#9195AA"}/>
                            Added albums
                        </button>
                    </div>
                    <div>
                        <div id="yourReviews" className="tabContent flexColumn rowGap16" style={{display: activeTab === "yourReviews" ? 'block' : 'none'}}>
                            {finalReviews && finalReviews.length > 0 ? (
                                finalReviews.map((review) => (
                                    <UserReviewTile
                                        id={review.id}
                                        key={review.id}
                                        title={review.album.albumTitle}
                                        author={review.album.author.name}
                                        status={review.status}
                                        rate={review.rate}
                                        content={review.content}/>
                                ))
                            ) : (
                                <p>You didn't add any reviews yet</p>
                            )}
                        </div>
                        <div id="addedAlbums" className="tabContent flexColumn rowGap16" style={{display: activeTab === "addedAlbums" ? 'block' : 'none'}}>
                            {finalAlbums && finalAlbums.length > 0 ? (
                                finalAlbums.map((album) => (
                                    <UserAlbumTile
                                        id={album.id}
                                        key={album.id}
                                        coverImage={album.coverImageURL}
                                        title={album.albumTitle}
                                        author={album.author.name}
                                        releaseDate={album.releaseDate}
                                        category={album.category.name}
                                        language={album.language.name}
                                        description={album.description}
                                        status={album.status}
                                    />
                                ))
                            ) : (
                                <p>You didn't add any albums yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};