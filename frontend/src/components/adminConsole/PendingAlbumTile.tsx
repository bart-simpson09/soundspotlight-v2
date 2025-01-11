import React from 'react';

interface PendingAlbumTileProps {
    id: string;
    coverImage: string;
    title: string;
    author: string;
    releaseDate: string;
    category: string;
    language: string;
    description: string;
    addedBy: string;
    onApprove: () => void;
    onDecline: () => void;
}

const PendingAlbumTile: React.FC<PendingAlbumTileProps> = ({
                                                               id,
                                                               coverImage,
                                                               title,
                                                               author,
                                                               releaseDate,
                                                               category,
                                                               language,
                                                               description,
                                                               addedBy,
                                                               onApprove,
                                                               onDecline
                                                           }) => {
    return (
        <div key={id} className="yourProfileItem flexRow columnGap16">
            <img src={coverImage}
                 className="albumSmallCover"
                 alt=""/>
            <div className="flexColumn rowGap16" style={{width: '100%'}}>
                <div className="flexRow yourProfileItemHeader">
                    <div className="flexColumn rowGap4">
                        <h4>{title}</h4>
                        <h5>{author}</h5>
                    </div>
                    <div className="flexRow columnGap8">
                        <button className="buttonOutlined positiveAction" onClick={onApprove}>Approve</button>
                        <button className="buttonOutlined importantAction" onClick={onDecline}>Decline</button>
                    </div>
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
                            <p>{releaseDate}</p>
                        </div>
                    </div>
                    <p className="shortAlbumDescription">{description}</p>
                    <span className="pendingDivider"></span>
                    <div className="flexRow columnGap8">
                        <h5>Added by:</h5>
                        <p>{addedBy}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingAlbumTile;
