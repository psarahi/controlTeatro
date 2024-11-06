import React from 'react'
import { AppRouter } from './router/AppRouter'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import logo from './logo512.png'

export const ControlApp = () => {
    const navigate = useNavigate();

    const items = [
        {
            label: 'Calendario de eventos',
            icon: 'pi pi-calendar',
            command: () => {
                navigate('calendario')
            },
        },
        {
            label: 'Asignación de asientos',
            icon: 'pi pi-ticket',
            command: () => {
                navigate('layoutSillas')
            }
        },
        {
            label: 'Lista de Eventos',
            icon: 'pi pi-list',
            command: () => {
                navigate('evento')
            }
        },
    ];

    const start = <img alt="logo" src={logo} height="40" className="mr-2"></img>;

    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <div style={{ backgroundColor: 'rgb(66 136 209 / 54%)' }}>
                    <p style={{
                        fontSize: '30px',
                        textAlign: 'center',
                        margin: '16px',
                        fontWeight: 300,
                    }}>Control de Asignación de Asientos</p>
                </div>
                <Menubar
                    model={items}
                    style={{ backgroundColor: 'rgb(135 191 231 / 32%)', margin: '-2px' }}
                    start={start}
                    active={false}
                />
                <AppRouter />
            </div>
        </>
    )
}
