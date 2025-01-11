import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {Login} from './pages/login/Login';
import {Register} from './pages/register/Register';
import {Dashboard} from './pages/dashboard/Dashboard';
import {NotFound} from './pages/NotFound';
import {AddAlbum} from './pages/addAlbum/AddAlbum';
import {AdminConsole} from './pages/adminConsole/AdminConsole';
import {AlbumDetails} from './pages/albumDetails/AlbumDetails';
import {MyProfile} from './pages/myProfile/MyProfile';
import {TopAlbums} from './pages/topAlbums/TopAlbums';
import {YourFavorites} from './pages/yourFavorites/YourFavorites';

export const AppRoutes: React.FC = () => (
    <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/addAlbum" element={<AddAlbum/>}/>
        <Route path="/adminConsole" element={<AdminConsole/>}/>
        <Route path="/albumDetails/:albumId" element={<AlbumDetails/>}/>
        <Route path="/myProfile" element={<MyProfile/>}/>
        <Route path="/topAlbums" element={<TopAlbums/>}/>
        <Route path="/yourFavorites" element={<YourFavorites/>}/>
        <Route path="*" element={<NotFound/>}/>
    </Routes>
);
