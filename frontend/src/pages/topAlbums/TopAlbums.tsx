import React, {useEffect, useState} from "react";
import NavBar from "../../components/navBar/NavBar";
import {useLocation, useNavigate} from "react-router-dom";
import {Album} from "../../types/album";
import AlbumTile from "../../components/albumTile/AlbumTile";
import {useTopAlbums} from "./useTopAlbums";

export const TopAlbums: React.FC = () => {

    let location = useLocation();
    const { albums, loading, fetchData, toggleFavorite } = useTopAlbums();
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
        setAlbums((prevAlbums) =>
            prevAlbums?.map((album) =>
                album.id === albumId ? { ...album, isFavorite: !album.isFavorite } : album
            )
        );
    };

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    console.log(refreshedAlbums);

    return (
        <div>
            <NavBar highlighted="topAlbums" />

            <div className="globalPageContainer flexColumn">
                <div className="flexColumn rowGap24">
                    <h1>Top 3 albums</h1>
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