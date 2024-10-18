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
                <Menubar model={items} style={{backgroundColor: '#00d7ee', margin: '-2px'}}/>
                
            </div>
        </>
    )
}
