import React from 'react'
import { AppRouter } from './router/AppRouter'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';

export const ControlApp = () => {
    const navigate = useNavigate();

    const items = [
        {
            label: 'Evento',
            icon: 'pi pi-calendar',
            command: () => {
                navigate('evento')
            }
        },
        {
            label: 'Sillas',
            icon: 'pi pi-ticket',
            command: () => {
                navigate('layoutSillas')
            }
        },
    ];

    return (
        <>
            <div className="card">
                <Menubar model={items} style={{backgroundColor: 'rgb(149 196 246)', margin: '-2px'}}/>
                <AppRouter/>
            </div>
        </>
    )
}
