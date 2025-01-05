import React, {useEffect, useState} from "react";
import NavBar from "../../components/navBar/NavBar";
import {useAddAlbum} from "./UseAddAlbum";
import defaultCover from "../../assets/default-cover.png";

export const AddAlbum: React.FC = () => {

    const { languages, categories, addAlbum } = useAddAlbum();
    const [title, setTitle] = useState<string>('');
    const [author, setAuthor] = useState<string>('');
    const [language, setLanguage] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [releaseDate, setReleaseDate] = useState<string>('');
    const [numberOfSongs, setNumberOfSongs] = useState<number>();
    const [description, setDescription] = useState<string>('');
    const [albumCover, setAlbumCover] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        document.title = 'Add album';
        document.body.classList.remove("singleFormBody");

        if (languages && languages.length > 0) {
            setLanguage(languages[0].id);
        }
        if (categories && categories.length > 0) {
            setCategory(categories[0].id);
        }

    }, [languages, categories]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setAlbumCover(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!numberOfSongs || numberOfSongs <= 0) {
            alert("Number of songs must be greater than 0");
            return;
        }

        const formData = new FormData();
        if (albumCover) {
            formData.append("albumCover", albumCover);
        }
        formData.append("title", title);
        formData.append("author", author);
        formData.append("language", language);
        formData.append("category", category);
        formData.append("releaseDate", releaseDate);
        formData.append("numberOfSongs", numberOfSongs?.toString() || '');
        formData.append("description", description);

        await addAlbum(formData);

        setTitle('');
        setAuthor('');
        setLanguage(languages?.[0]?.id || '');
        setCategory(categories?.[0]?.id || '');
        setReleaseDate('');
        setNumberOfSongs(0);
        setDescription('');
        setAlbumCover(null);
        setPreview(null);
    };

    return (
        <>
        <NavBar highlighted="none" />
        <div className="globalPageContainer flexColumn rowGap32 narrowPageContainer">
            <h1>Add new album</h1>
            <form id="addAlbumForm" onSubmit={handleSubmit} className="flexColumn rowGap32" method="POST"
                  encType="multipart/form-data">
                <div className="flexRow columnGap24">
                    <img id="uploadedCoverPreview" className="myProfileAvatar" src={preview || defaultCover}
                         alt=""/>
                    <input type="file" onChange={handleFileChange} id="photoInput"
                           name="albumCover" accept="image/png, image/jpeg" required/>
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
                                   min="1"
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