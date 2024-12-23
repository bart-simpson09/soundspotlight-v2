import React, {useEffect, useState} from 'react';
import {Heart} from "iconoir-react";
import { useNavigate } from "react-router-dom";

interface AlbumTileProps {
    id: string;
    coverImage: string;
    title: string;
    author: string;
    releaseDate: string
    rate: number;
    category: string;
    language: string;
}

const AlbumTile: React.FC<AlbumTileProps> = ({id, coverImage, title, author, releaseDate, rate, category, language }) => {
    const navigate = useNavigate();

    return (
        <div className="albumItemContainer">
        <a href="#" className="albumItem flexColumn rowGap24">
            <div className="albumItemCoverArea">
                <img className="albumItemCover" src={coverImage} alt="Album-Cover"/>
            </div>
            <div className="albumItemContent flexColumn rowGap24">
                <div className="flexColumn rowGap4">
                    <h3>{title}</h3>
                    <p>{author}</p>
                </div>
                <div className="flexColumn rowGap8">
                    <div className="flexRow columnGap8">
                        <p className="albumItemDetailLabel">Release date</p>
                        <p className="albumItemDetailText">{releaseDate}</p>
                    </div>
                    <div className="flexRow columnGap8">
                        <p className="albumItemDetailLabel">Rate</p>
                        <p className="albumItemDetailText">{rate}</p>
                    </div>
                    <div className="flexRow columnGap8">
                        <p className="albumItemDetailLabel">Category</p>
                        <p className="albumItemDetailText">{category}</p>
                    </div>
                    <div className="flexRow columnGap8">
                        <p className="albumItemDetailLabel">Language</p>
                        <p className="albumItemDetailText">{language}</p>
                    </div>
                </div>
            </div>
        </a>
        <div className="favouriteButtonDefault flexCenter favoriteButton">
            <Heart color="#ffffff" width={20} height={20} />
        </div>
    </div>
)
    ;
};

export default AlbumTile;