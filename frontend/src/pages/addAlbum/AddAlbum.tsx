import React, {useEffect, useState} from "react";
import NavBar from "../../components/navBar/NavBar";
import {useAddAlbum} from "./UseAddAlbum";

export const AddAlbum: React.FC = () => {

    const { languages, categories, loading } = useAddAlbum();
    //const [cover, setCover] = useState<Image>('');
    const [title, setTitle] = useState<string>('');
    const [author, setAuthor] = useState<string>('');
    const [language, setLanguage] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [releaseDate, setReleaseDate] = useState<string>('');
    const [numberOfSongs, setNumberOfSongs] = useState<number>();
    const [description, setDescription] = useState<string>('');

    useEffect(() => {
        document.title = 'Add album';
        document.body.classList.remove("singleFormBody");
    }, []);

    return (
        <>
        <NavBar highlighted="none" />
        <div className="globalPageContainer flexColumn rowGap32 narrowPageContainer">
            <h1>Add new album</h1>
            <form id="addAlbumForm" action="addAlbum" className="flexColumn rowGap32" method="POST"
                  encType="multipart/form-data">
                <div className="flexRow columnGap24">
                    <img id="uploadedCoverPreview" className="myProfileAvatar" src="/public/assets/default-cover.png"
                         alt=""/>
                    <input type="file" id="photoInput" name="albumCover" accept="image/png, image/jpeg" required/>
                </div>
                <div className="flexColumn rowGap16">
                    <div className="flexRow columnGap16 rowGap16 mobileWrapped">
                        <div className="inputArea flexColumn rowGap8">
                            <label htmlFor="albumTitle">Album title</label>
                            <input type="text"
                                   name="albumTitle"
                                   id="albumTitle"
                                   placeholder="Type album title"
                                   required
                                   value={title}
                                   onChange={(e) => setTitle(e.target.value)}/>
                        </div>
                        <div className="inputArea flexColumn rowGap8">
                            <label htmlFor="authorName">Author name</label>
                            <input type="text"
                                   name="authorName"
                                   id="authorName"
                                   placeholder="Type author name"
                                   required
                                   value={author}
                                   onChange={(e) => setAuthor(e.target.value)}/>
                        </div>
                    </div>
                    <div className="flexRow columnGap16 rowGap16 mobileWrapped">
                        <div className="inputArea flexColumn rowGap8">
                            <label htmlFor="language">Language</label>
                            <div className="customSelect">
                                <select
                                    id="language"
                                    name="language"
                                    required
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}>
                                    {languages?.map(language => (
                                        <option key={language.id} value={language.id}>
                                            {language.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="inputArea flexColumn rowGap8">
                            <label htmlFor="category">Category</label>
                            <div className="customSelect">
                                <select
                                    id="category"
                                    name="category"
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}>
                                    {categories?.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flexRow columnGap16 rowGap16 mobileWrapped">
                        <div className="inputArea flexColumn rowGap8">
                            <label htmlFor="releaseDate">Release date</label>
                            <input type="date"
                                   name="releaseDate"
                                   id="releaseDate"
                                   required
                                   value={releaseDate}
                                   onChange={(e) => setReleaseDate(e.target.value)}/>
                        </div>
                        <div className="inputArea flexColumn rowGap8">
                            <label htmlFor="songsNumber">Number of songs</label>
                            <input type="number"
                                   name="songsNumber"
                                   id="songsNumber"
                                   placeholder="Type number of songs"
                                   required
                                   value={numberOfSongs}
                                   onChange={(e) => setNumberOfSongs(Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="inputArea flexColumn rowGap8">
                        <label htmlFor="description">Description</label>
                        <textarea name="description"
                                  id="description"
                                  cols={30} rows={10}
                                  placeholder="Type album description"
                                  required
                                  value={description}
                                  onChange={(e) => setDescription(e.target.value)}>
                        </textarea>
                    </div>
                </div>
                <button type="submit" className="buttonPrimary" id="submitButton">Add new album</button>
            </form>
        </div>
        </>
    );
};