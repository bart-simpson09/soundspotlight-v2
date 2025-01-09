import React from 'react';

interface AlbumTileProps {
    id: string;
    coverImage: string;
    title: string;
    author: string;
    releaseDate: Date;
    category: string;
    language: string;
    description: string;
    status: string;
}

const renderStatus = (status: string) => {
    switch (status) {
        case 'pending':
            return <div className="yourAddedElementStatus statusPending flexCenter">Pending</div>;
        case 'published':
            return <div className="yourAddedElementStatus statusApproved flexCenter">Approved</div>;
        case 'rejected':
            return <div className="yourAddedElementStatus statusDeclined flexCenter">Declined</div>;
        default:
            return null;
    }
};

const UserAlbumTile: React.FC<AlbumTileProps> = ({ id, coverImage, title, author, releaseDate, category, language, description, status }) => {
    return (
        <div key={id} className="yourProfileItem flexRow columnGap16">
            <img src={coverImage} className="albumSmallCover" alt=""/>
            <div className="flexColumn rowGap16" style={{width: "100%"}}>
                <div className="flexRow yourProfileItemHeader">
                    <div className="flexColumn rowGap4">
                        <h4>{title}</h4>
                        <h5>{author}</h5>
                    </div>
                    {renderStatus(status)}
                </div>
                <span className="dividerHorizon40"></span>
                <div className="flexColumn rowGap8">
                    <div className="flexRow columnGap32 flexWrap">
                        <div className="flexRow columnGap8">
                            <h5>Category:</h5>
                            <p>{category}</p>
                        </div>
                        <div className="flexRow columnGap8">
                            <h5>Language:</h5>
                            <p>{language}</p>
                        </div>
                        <div className="flexRow columnGap8">
                            <h5>Release date:</h5>
                            <p>{releaseDate.toString()}</p>
                        </div>
                    </div>
                    <p className="shortAlbumDescription">{description}</p>
                </div>
            </div>
        </div>
    );
};

export default UserAlbumTile;