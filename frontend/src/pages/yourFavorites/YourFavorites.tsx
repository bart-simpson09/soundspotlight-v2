import React, {useEffect, useState} from "react";
import NavBar from "../../components/navBar/NavBar";
import AlbumTile from "../../components/albumTile/AlbumTile";
import {useLocation, useNavigate} from "react-router-dom";
import {Album} from "../../types/album";
import {useYourFavorites} from "./UseYourFavorites";

export const YourFavorites: React.FC = () => {
    let location = useLocation();
    const { albums, loading, fetchData, toggleFavorite } = useYourFavorites();
    const navigate = useNavigate();

    const [refreshedAlbums, setAlbums] = useState<Album[] | undefined>(albums);

    useEffect(() => {
        document.title = 'Your favorites';
        document.body.classList.remove("singleFormBody");
        fetchData();
    }, [location]);

    useEffect(() => {
        setAlbums(albums);
    }, [albums]);

    const handleAlbumClick = (id: string) => {
        navigate(`/albumDetails/${id}`);
    };

    const handleToggleFavorite = async (albumId: string) => {
        await toggleFavorite(albumId);
        await fetchData();
    };

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div>
            <NavBar highlighted="yourFavorites" />

            <div className="globalPageContainer flexColumn">
                <div className="flexColumn rowGap24">
                    <h1>Your favorite albums</h1>
                </div>

                {refreshedAlbums && refreshedAlbums.length === 0 && (
                    <p>You don't have any favorite albums yet. Start exploring and add some!</p>
                )}

                <div className="albumsList">
                    {refreshedAlbums?.map(album => (
                        <AlbumTile
                            key={album.id}
                            id={album.id}
                            coverImage={album.coverImageURL}
                            title={album.albumTitle}
                            author={album.author.name}
                            releaseDate={album.releaseDate.toString()}
                            rate={album.avgRate}
                            category={album.category.name}
                            language={album.language.name}
                            onClick={() => handleAlbumClick(album.id)}
                            isFavorite={album.isFavorite}
                            toggleFavorite={() => handleToggleFavorite(album.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};