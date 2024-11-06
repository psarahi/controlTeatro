import React from 'react'
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
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
            label: 'Asignación de Sillas',
            icon: 'pi pi-ticket',
            command: () => {
                navigate('layoutSillas')
            }
        },
    ];
    return (
        <>
            <div className="card">
            <h1>Control de asignación de asientos</h1>

                <Menubar model={items} style={{backgroundColor: '#00d7ee', margin: '-2px'}}/>
            </div>
            <div>
                
            </div>
        </>
    )
}
