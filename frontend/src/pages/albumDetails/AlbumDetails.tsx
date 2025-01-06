import React, {useEffect} from "react";
import NavBar from "../../components/navBar/NavBar";
import {ArrowLeft, Calendar, Heart, HeartSolid, Language, MusicDoubleNote, Star} from "iconoir-react";
import {useAlbumDetails} from "./UseAlbumDetails";
import {useNavigate, useParams} from "react-router-dom";

export const AlbumDetails: React.FC = () => {
    const { album, fetchData, toggleFavorite } = useAlbumDetails();
    const { albumId } = useParams<{ albumId: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Album details';
        document.body.classList.remove("singleFormBody");

        if (albumId) {
            fetchData(albumId);
        }

    }, [albumId]);

    const handleToggleFavorite = async (albumId: string) => {
        await toggleFavorite(albumId);
        fetchData(albumId);
    };

    return (
        <div>
            <NavBar highlighted="none"/>

            <div className="globalPageContainer flexColumn rowGap32 narrowPageContainer">
                <div className="flexRow columnGap8 goBackButton" onClick={() => navigate('/')}>
                    <ArrowLeft width={20} height={20}/> Go back to albums
                </div>
                <div className="flexColumn rowGap24 topAlbumSection">
                    <div className="flexRow columnGap32 albumDetailsTop">
                        <img className="albumDetailsCover" src={album?.coverImageURL}
                             alt=""/>
                        <div className="flexColumn rowGap32">
                            <div className="flexColumn rowGap16">
                                <div className="flexColumn rowGap8">
                                    <div className="flexRow columnGap16">
                                        <h1>{album?.albumTitle}</h1>
                                        <div onClick={() => handleToggleFavorite(album?.id as string)} style={{ cursor: 'pointer' }}>
                                            {album?.isFavorite ? (
                                                <HeartSolid color="#4CA6A8" width={24} height={24}/>
                                            ) : (
                                                <Heart color="#4CA6A8" width={24} height={24}/>
                                            )}
                                        </div>
                                    </div>
                                    <p>{album?.author.name}</p>
                                </div>
                                <span className="dividerHorizon40"></span>
                            </div>
                            <div className="flexRow columnGap24 rowGap16 albumDetailsAttributeList">
                                <div className="flexRow columnGap8 albumDetailsAttribute">
                                    <div className="albumDetailsAttributeIcon flexCenter">
                                        <MusicDoubleNote color="#4CA6A8" width={20} height={20}/>
                                    </div>
                                    <p>{album?.numberOfSongs} songs</p>
                                </div>
                                <div className="flexRow columnGap8 albumDetailsAttribute">
                                    <div className="albumDetailsAttributeIcon flexCenter">
                                        <Language color="#4CA6A8" width={20} height={20}/>
                                    </div>
                                    <p>{album?.language.name}</p>
                                </div>
                                <div className="flexRow columnGap8 albumDetailsAttribute">
                                    <div className="albumDetailsAttributeIcon flexCenter">
                                        <Calendar color="#4CA6A8" width={20} height={20}/>
                                    </div>
                                    <p>{album?.releaseDate.toString()}</p>
                                </div>
                                <div className="flexRow columnGap8 albumDetailsAttribute">
                                    <div className="albumDetailsAttributeIcon flexCenter">
                                        <Star color="#4CA6A8" width={20} height={20}/>
                                    </div>
                                    <p>{album?.avgRate} / 5</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="albumDetailsDescription">{album?.description}</p>
                </div>
                <div className="albumDetailsOpinions flexColumn rowGap24">
                    <div className="flexRow header">
                        <h2>People opinions</h2>
                        <button className="buttonPrimary">Add
                            your review
                        </button>
                    </div>
                    <div className="flexColumn rowGap16 reviewsList">
                        <div className="albumDetailsOpinionItem flexRow columnGap16">
                            <img className="standardAvatar"
                                 src="#"
                                 alt=""/>
                            <div className="flexColumn rowGap8 opinionContent">
                                <div className="flexRow opinionHeader">
                                    <div className="opinionBasicInfo flexRow columnGap8">
                                        <p className="opinionAuthor">opinion author</p>
                                        <span className="opinionItemDivider"></span>
                                        <p id="creationDate">creation date</p>
                                    </div>
                                    <div className="flexRow columnGap8 opinionRate">
                                        review rate
                                        <i className="iconoir-star-solid"></i>
                                    </div>
                                </div>
                                <p className="opinionDescription">secription</p>
                            </div>
                        </div>
                        <p>This album doesn't have any opinions yet. Let's add your review!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};