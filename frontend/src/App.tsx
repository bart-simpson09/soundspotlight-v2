import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {AppRoutes} from './AppRoutes';
import {SessionManagerProvider} from "./utils/sessionManager";

import './styles/reset.css';
import './styles/fonts.css';
import './styles/colors.css';
import './styles/flex.css';
import './styles/global.css';
import './styles/components.css';
import './styles/responsive.css';

export const App: React.FC = () => {
    return (
        <BrowserRouter>
            <SessionManagerProvider>
                <AppRoutes/>
            </SessionManagerProvider>
        </BrowserRouter>
    );
};