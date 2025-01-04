import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login } from './pages/login/Login';
import { Register } from './pages/register/Register';
import { Dashboard } from './pages/dashboard/Dashboard';
import { NotFound } from './pages/NotFound';
import { AddAlbum } from './pages/addAlbum/AddAlbum';
import { AdminConsole } from './pages/AdminConsole';
import { AlbumDetails } from './pages/AlbumDetails';
import { MyProfile } from './pages/MyProfile';
import { TopAlbums } from './pages/TopAlbums';
import { YourFavorites } from './pages/YourFavorites';

export const AppRoutes: React.FC = () => (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addAlbum" element={<AddAlbum />} />
        <Route path="/adminConsole" element={<AdminConsole />} />
        <Route path="/albumDetails" element={<AlbumDetails />} />
        <Route path="/myProfile" element={<MyProfile />} />
        <Route path="/topAlbums" element={<TopAlbums />} />
        <Route path="/yourFavorites" element={<YourFavorites />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
);

