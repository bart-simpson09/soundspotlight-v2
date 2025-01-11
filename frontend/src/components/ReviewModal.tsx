import React, {useState} from 'react';
import {Star, StarSolid} from "iconoir-react";

const ReviewModal: React.FC<{ onClose: () => void, onSubmit: (review: string, rating: number) => void }> = ({
                                                                                                                onClose,
                                                                                                                onSubmit
                                                                                                            }) => {
    const [reviewContent, setReviewContent] = useState('');
    const [rating, setRating] = useState(0);

    const handleStarClick = (index: number) => {
        if (rating === index + 1) {
            setRating(0);
        } else {
            setRating(index + 1);
        }
    };

    const handleSubmit = () => {
        if (reviewContent.trim() && rating > 0) {
            onSubmit(reviewContent, rating);
            onClose();
        }
    };

    const isDisabled = !reviewContent.trim() || rating === 0;

    return (
        <div className="modal flexColumn rowGap24">
            <div className="flexColumn rowGap8">
                <h2>Add your review</h2>
                <p>Express your feelings about this album in the field below.</p>
            </div>

            <div className="flexColumn rowGap16">
                <textarea
                    name="reviewContent"
                    id="reviewContent"
                    cols={30}
                    rows={10}
                    placeholder="Type your review here"
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                ></textarea>
                <div className="flexRow columnGap8 stars">
                    {[...Array(5)].map((_, index) => {
                        const isSelected = index < rating;
                        const Icon = isSelected ? StarSolid : Star;

                        return (
                            <Icon
                                key={index}
                                color={isSelected ? "#FFD700" : "#6B717D"}
                                width={20}
                                height={20}
                                onClick={() => handleStarClick(index)}
                                style={{cursor: 'pointer'}}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="flexRow columnGap16">
                <button className="buttonOutlined" style={{padding: '10.5px 16px'}} onClick={onClose}>
                    Cancel
                </button>
                <button
                    className={`buttonPrimary ${isDisabled ? 'buttonDisabled' : ''}`}
                    onClick={handleSubmit}
                    disabled={isDisabled}
                >
                    Add review
                </button>
            </div>
        </div>
    );
};

export default ReviewModal;
