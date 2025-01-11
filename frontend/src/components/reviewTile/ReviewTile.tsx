import React from 'react';
import {StarSolid} from "iconoir-react";

interface ReviewTileProps {
    id: string;
    createDate: Date;
    rate: string;
    content: string;
    authorFirstName: string;
    authorLastName: string;
    authorAvatar: string;
}

const ReviewTile: React.FC<ReviewTileProps> = ({
                                                   id,
                                                   createDate,
                                                   rate,
                                                   content,
                                                   authorFirstName,
                                                   authorLastName,
                                                   authorAvatar
                                               }) => {

    const date = new Date(createDate);

    return (
        <div key={id} className="albumDetailsOpinionItem flexRow columnGap16">
            <img className="standardAvatar" src={authorAvatar} alt=""/>
            <div className="flexColumn rowGap8 opinionContent">
                <div className="flexRow opinionHeader">
                    <div className="opinionBasicInfo flexRow columnGap8">
                        <p className="opinionAuthor">{authorFirstName} {authorLastName}</p>
                        <span className="opinionItemDivider"></span>
                        <p id="creationDate">{date.toLocaleString("pl-PL")}</p>
                    </div>
                    <div className="flexRow columnGap8 opinionRate">
                        {rate}/5
                        <StarSolid/>
                    </div>
                </div>
                <p className="opinionDescription">{content}</p>
            </div>
        </div>
    );
};

export default ReviewTile;
