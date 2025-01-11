import React from 'react';
import {UserCrown} from "iconoir-react";

interface PendingAlbumTileProps {
    id: string;
    avatar: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    currentUserId: string;
    revokeAdmin: () => void;
    grantAdmin: () => void;
}

const UserTile: React.FC<PendingAlbumTileProps> = ({
                                                       id,
                                                       avatar,
                                                       firstName,
                                                       lastName,
                                                       email,
                                                       currentUserId,
                                                       role,
                                                       revokeAdmin,
                                                       grantAdmin
                                                   }) => {

    return (
        <div key={id} className="yourProfileItem flexRow yourProfileItemHeader">
            <div className="flexRow columnGap16">
                <img className="standardAvatar" src={avatar} alt=""/>
                <div className="flexColumn">
                    <div className="flexRow columnGap4" id="userNameSection">
                        <h4>{firstName} {lastName}</h4>
                        {role === "admin" && <UserCrown color={"#4CA6A8"} width={"20px"} height={"20px"}/>}
                    </div>
                    <h5>{email}</h5>
                </div>
            </div>
            <div className="flexRow columnGap8">
                {currentUserId === id ? (
                    <h5>This is your account</h5>
                ) : (
                    <>
                        {role === "admin" ? (
                            <button className="buttonOutlined" onClick={revokeAdmin}>Revoke admin role</button>
                        ) : (
                            <button className="buttonOutlined" onClick={grantAdmin}>Grant admin role</button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UserTile;
