import React, { useEffect } from "react";
import NavBar from "../../components/NavBar";
import { useLocation } from "react-router-dom";
import {useDashboard} from "./UseDashboard";
import {AlbumList, CompactDisc, Language, User} from "iconoir-react";

export const Dashboard: React.FC = () => {
    let location = useLocation();
    const {languages, loading } = useDashboard();


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
                                <CompactDisc className={"inputIcon"} />
                            </div>
                        </div>

                        <div className="inputArea flexColumn rowGap8">
                            <label htmlFor="artistName">Artist name</label>
                            <div className="inputWithIcon">
                                <input type="text" name="artistName" id="artistName" placeholder="Type artist name"/>
                                <User className={"inputIcon"} />
                            </div>
                        </div>

                        <div className="inputArea flexColumn rowGap8">
                            <label htmlFor="category">Category</label>
                            <div className="inputWithIcon">
                                <div className="customSelect">
                                    <select name="category" id="category">
                                        <option value="0">All categories</option>
                                        {/*<?php foreach ($categories as $category): ?>*/}
                                        {/*<option*/}
                                        {/*    value="<?= $category->getCategoryId() ?>"><?= $category->getCategoryName() ?></option>*/}
                                        {/*<?php endforeach; ?>*/}
                                    </select>
                                </div>
                                <AlbumList className={"inputIcon"} />
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
                                <Language className={"inputIcon"} />
                            </div>
                        </div>

                        <button className="buttonPrimary" id="searchButton">Search albums</button>
                    </div>
                </div>
            </div>

        </>
    );
};