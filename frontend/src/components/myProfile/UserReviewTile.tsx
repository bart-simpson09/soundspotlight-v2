import React from 'react';
import {StarSolid} from "iconoir-react";

interface UserReviewTileProps {
    id: string;
    title: string;
    author: string;
    status: string;
    rate: number;
    content: string;
}

const renderStatus = (status: string) => {
    switch (status) {
        case 'pending':
            return <div className="yourAddedElementStatus statusPending flexCenter">Pending</div>;
        case 'approved':
            return <div className="yourAddedElementStatus statusApproved flexCenter">Approved</div>;
        case 'rejected':
            return <div className="yourAddedElementStatus statusDeclined flexCenter">Declined</div>;
        default:
            return null;
    }
};

const UserReviewTile: React.FC<UserReviewTileProps> = ({id, title, author, status, rate, content}) => {
    return (
        <div key={id} className="yourProfileItem flexColumn rowGap16">
            <div className="flexRow yourProfileItemHeader">
                <div className="flexColumn rowGap4">
                    <h4>{title}</h4>
                    <h5>{author}</h5>
                </div>
                <div className="flexRow columnGap16">
                    <div className="flexRow columnGap8 opinionRate">
                        <StarSolid/>
                        {rate} / 5
                    </div>
                    {renderStatus(status)}
                </div>
            </div>
            <p>{content}</p>
        </div>
    );
};

export default UserReviewTile;