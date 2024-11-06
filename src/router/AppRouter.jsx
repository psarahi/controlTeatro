import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Evento } from '../componentes/pages/Evento';
import { LayaoutSillas } from '../componentes/pages/LayaoutSillas';
import { Calendario } from '../componentes/pages/Calendario';

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="evento" element={<Evento />} />
            <Route path="layoutSillas" element={<LayaoutSillas />} />
            <Route path="calendario" element={<Calendario />} />

            <Route path="/*" element={<Evento />} />
        </Routes>
    )
}
