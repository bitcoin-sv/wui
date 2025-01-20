import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import HomePage from './pages/HomePage';
import ActionsPage from './pages/ActionsPage';
import OutputsPage from './pages/OutputsPage';
import KeysLinkagePage from './pages/KeysLinkagePage';
import CryptoPage from './pages/CryptoPage';
import CertificatesPage from './pages/CertificatesPage';
import UtilitiesPage from './pages/UtilitiesPage';

import MainLayout from './components/MainLayout';
import { WalletProvider } from './contexts/WalletContext';

// MUI Theme:
const theme = createTheme({
    palette: {
        mode: 'light'
    }
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* The WalletProvider makes the wallet instance available throughout the app */}
            <WalletProvider>
                <BrowserRouter>
                    <Routes>
                        {/* The home page handles private key input */}
                        <Route path="/" element={<HomePage />} />

                        {/* Once we have a wallet, everything else is under our MainLayout */}
                        <Route element={<MainLayout />}>
                            <Route path="/actions" element={<ActionsPage />} />
                            <Route path="/outputs" element={<OutputsPage />} />
                            <Route path="/keys" element={<KeysLinkagePage />} />
                            <Route path="/crypto" element={<CryptoPage />} />
                            <Route path="/certificates" element={<CertificatesPage />} />
                            <Route path="/utilities" element={<UtilitiesPage />} />
                        </Route>

                        {/* Fallback route */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </BrowserRouter>
            </WalletProvider>
        </ThemeProvider>
    );
}

export default App;
