import React from 'react';
import {StarSolid} from "iconoir-react";

interface PendingReviewTileProps {
    id: string;
    rate: string;
    content: string;
    albumTitle: string;
    albumAuthorName: string;
    reviewAuthorFirstName: string;
    reviewAuthorLastName: string;
    onApprove: () => void;
    onDecline: () => void;
}

const PendingReviewTile: React.FC<PendingReviewTileProps> = ({
                                                                 id,
                                                                 rate,
                                                                 content,
                                                                 albumTitle,
                                                                 albumAuthorName,
                                                                 reviewAuthorFirstName,
                                                                 reviewAuthorLastName,
                                                                 onApprove,
                                                                 onDecline
                                                             }) => {
    return (
        <div key={id} className="yourProfileItem flexColumn rowGap16">
            <div className="flexRow yourProfileItemHeader">
                <div className="flexColumn rowGap4">
                    <h4>{albumTitle}</h4>
                    <h5>{albumAuthorName}</h5>
                </div>
                <div className="flexRow columnGap16">
                    <div className="flexRow columnGap8 opinionRate">
                        <StarSolid/> {rate}/5
                    </div>
                    <div className="flexRow columnGap8">
                        <button className="buttonOutlined positiveAction" onClick={onApprove}>Approve</button>
                        <button className="buttonOutlined importantAction" onClick={onDecline}>Decline</button>
                    </div>
                </div>
            </div>
            <p>{content}</p>
            <span className="pendingDivider"></span>
            <div className="flexRow columnGap8">
                <h5>Added by:</h5>
                <p>{reviewAuthorFirstName} {reviewAuthorLastName}</p>
            </div>
        </div>
    );
};

export default PendingReviewTile;
