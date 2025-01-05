import React, { useEffect, useState } from "react";
import NavBar from "../../components/navBar/NavBar";
import { useLocation, useNavigate } from "react-router-dom";
import { useDashboard } from "./UseDashboard";
import { AlbumList, CompactDisc, Language, User } from "iconoir-react";
import AlbumTile from "../../components/albumTile/AlbumTile";
import {Album} from "../../types/album";

export const Dashboard: React.FC = () => {
    let location = useLocation();
    const { albums, languages, categories, loading, searchAlbums, fetchData } = useDashboard();
    const navigate = useNavigate();

    const [title, setTitle] = useState<string>('');
    const [author, setAuthor] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [language, setLanguage] = useState<string>('');
    const [searchedAlbums, setAlbums] = useState<Album[] | undefined>(albums);

    useEffect(() => {
        document.title = 'Dashboard';
        document.body.classList.remove("singleFormBody");
        fetchData();
    }, [location]);

    useEffect(() => {
        setAlbums(albums);
    }, [albums]);

    const handleSearch = async () => {
        if (!title && !author && category === '0' && language === '0') {
            fetchData();
        } else {
            const searchedAlbums = await searchAlbums(
                title,
                author,
                category !== '0' ? category : undefined,
                language !== '0' ? language : undefined
            );
            setAlbums(searchedAlbums || []);
        }
    };

    const handleAlbumClick = (id: string) => {
        navigate(`/albumDetails/${id}`);
    };

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <>
            <NavBar highlighted="home" />

            <div className="globalPageContainer flexColumn">
                <div className="flexColumn rowGap24">
                    <h1>Albums in our library</h1>

                    <div className="flexRow searchBar columnGap16">

                        <div className="inputArea flexColumn rowGap8">
                            <label htmlFor="albumTitle">Album title</label>
                            <div className="inputWithIcon">
                                <input
                                    type="text"
                                    name="albumTitle"
                                    id="albumTitle"
                                    placeholder="Type album title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <CompactDisc className={"inputIcon"} />
                            </div>
                        </div>

                        <div className="inputArea flexColumn rowGap8">
                            <label htmlFor="artistName">Artist name</label>
                            <div className="inputWithIcon">
                                <input
                                    type="text"
                                    name="artistName"
                                    id="artistName"
                                    placeholder="Type artist name"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                />
                                <User className={"inputIcon"} />
                            </div>
                        </div>

                        <div className="inputArea flexColumn rowGap8">
                            <label htmlFor="category">Category</label>
                            <div className="inputWithIcon">
                                <div className="customSelect">
                                    <select
                                        name="category"
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="0">All categories</option>
                                        {categories?.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <AlbumList className={"inputIcon"} />
                            </div>
                        </div>

                        <div className="inputArea flexColumn rowGap8">
                            <label htmlFor="language">Language</label>
                            <div className="inputWithIcon">
                                <div className="customSelect">
                                    <select
                                        name="language"
                                        id="language"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                    >
                                        <option value="0">All languages</option>
                                        {languages?.map(language => (
                                            <option key={language.id} value={language.id}>
                                                {language.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <Language className={"inputIcon"} />
                            </div>
                        </div>

                        <button className="buttonPrimary" id="searchButton" onClick={handleSearch}>
                            Search albums
                        </button>
                    </div>
                </div>

                <div className="albumsList">
                    {searchedAlbums?.map(album => (
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
                        />
                    ))}
                </div>
            </div>
        </>
    );
};