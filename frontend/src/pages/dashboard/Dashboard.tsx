import React, { useEffect } from "react";
import NavBar from "../../components/navBar/NavBar";
import { useLocation } from "react-router-dom";
import {useDashboard} from "./UseDashboard";
import {AlbumList, CompactDisc, Language, User} from "iconoir-react";
import AlbumTile from "../../components/albumTile/AlbumTile";

export const Dashboard: React.FC = () => {
    let location = useLocation();
    const {languages, categories, albums, loading } = useDashboard();


    useEffect(() => {
        document.title = 'Dashboard';
        document.body.classList.remove("singleFormBody");
        //console.log("Location State:", location);
        const userData = location.state?.userData;
        if (userData) {
            //console.log("User Data from Login:", userData);
        }
    }, [location]);

    if (loading) {
        return (
            <div>
                Loading...
            </div>

            )
    }

    return (
        <>
            <NavBar highlighted="home"/>

            <div className="globalPageContainer flexColumn">
                <div className="flexColumn rowGap24">
                    <h1>Albums in our library</h1>

                    <div className="flexRow searchBar columnGap16">

                        <div className="inputArea flexColumn rowGap8">
                            <label htmlFor="albumTitle">Album title</label>
                            <div className="inputWithIcon">
                                <input type="text" name="albumTitle" id="albumTitle" placeholder="Type album title"/>
                                <CompactDisc className={"inputIcon"}/>
                            </div>
                        </div>

                        <div className="inputArea flexColumn rowGap8">
                            <label htmlFor="artistName">Artist name</label>
                            <div className="inputWithIcon">
                                <input type="text" name="artistName" id="artistName" placeholder="Type artist name"/>
                                <User className={"inputIcon"}/>
                            </div>
                        </div>

                        <div className="inputArea flexColumn rowGap8">
                            <label htmlFor="category">Category</label>
                            <div className="inputWithIcon">
                                <div className="customSelect">
                                    <select name="category" id="category">
                                        <option value="0">All categories</option>
                                        {categories?.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <AlbumList className={"inputIcon"}/>
                            </div>
                        </div>

                        <div className="inputArea flexColumn rowGap8">
                            <label htmlFor="language">Language</label>
                            <div className="inputWithIcon">
                                <div className="customSelect">
                                    <select name="language" id="language">
                                        <option value="0">All languages</option>
                                        {languages?.map(language => (
                                            <option key={language.id} value={language.id}>
                                                {language.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <Language className={"inputIcon"}/>
                            </div>
                        </div>

                        <button className="buttonPrimary" id="searchButton">Search albums</button>
                    </div>
                </div>

                <div className="albumsList">
                    {albums?.map(album => (
                        <AlbumTile key={album.id} id={album.id} coverImage={album.coverImageURL} title={album.albumTitle} author={album.author.name} releaseDate={album.releaseDate.toString()} rate={album.avgRate} category={album.category.name} language={album.language.name}/>
                    ))}
                </div>
            </div>

        </>
    );
};