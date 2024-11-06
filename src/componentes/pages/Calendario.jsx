import React, { useEffect, useRef, useState } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
    format,
    parse,
    startOfWeek,
    addHours,
    getDay,
} from 'date-fns'
import esES from 'date-fns/locale/es'

import {
    Button, Dialog, Tag,
    InputText, Toast, Dropdown
} from "primereact";

import { getMessagesEs } from '../../helpers/getMessages';
import { apiControlTeatro } from '../../service/apiControlTeatro';

import './CalendarioStyle.css'
import { textValidator } from '../../helpers/validator';

const locales = {
    'es': esES
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

console.log(window.innerWidth);
console.log(window.innerHeight);

if (window.innerWidth < 1600) {
document.body.style.zoom = '93%';
}


export const Calendario = () => {

    const [listEventos, setlistEventos] = useState([]);
    const [selectedEvento, setselectedEvento] = useState('');
    const [selectedTeatroId, setselectedTeatroId] = useState('');
    const [listTeatro, setlistTeatro] = useState([{ name: '', code: '' }]);
    const [visible, setVisible] = useState(false);
    const [disabled, setdisabled] = useState(false)
    const [valueForm, setvalueForm] = useState({
        nombre: '',
        encargado: '',
        teatros: '',
        fecha: new Date(),
        estado: 'Programado',
        sillas: []
    });
    const estados = ['Programado', 'Pendiente', 'Cancelado', 'Finalizado'];

    const toast = useRef(null);

    const createToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 6000 });
    };

    useEffect(() => {
        let teatro = [];
        // let eventos = [];
        apiControlTeatro.get('teatro', '').then(({ data }) => {
            data.forEach(element => {
                teatro.push({
                    name: element.nombre,
                    code: element._id
                });
            });
            setlistTeatro(teatro);
        });
        // apiControlTeatro.get('evento', '').then(({ data }) => {
        //     console.log(data);
        //     data.forEach(element => {
        //         eventos.push({
        //             id: element._id,
        //             title: element.nombre,
        //             encargado: element.encargado,
        //             teatro: element.teatros._id,
        //             estado: element.estado,
        //             start: addHours(element.fecha, 0),
        //             end: addHours(element.fecha, 2),
        //         });
        //     });
        //     console.log(eventos);

        //     setlistEventos(eventos)
        // })
        // cleanForm();
    }, []);

    const handleChangeText = ({ target }, select) => {
        setvalueForm({
            ...valueForm,
            [select]: target.value
        })
    };


    const CalendarEvent = ({ event }) => {
        const { title, encargado } = event;

        return (
            <>
                <strong>{title}</strong>
                <span> - {encargado}</span>
            </>
        )
    }

    const eventStyleGetter = (event, start, end, isSelected) => {
        let backcolor = '';
        if (event.estado === 'Programado') backcolor = 'rgb(66 136 209)'
        if (event.estado === 'Pendiente') backcolor = 'rgb(245 192 47)'
        if (event.estado === 'Cancelado') backcolor = 'rgb(212 47 48)'
        if (event.estado === 'Finalizado') backcolor = 'rgb(104 160 57)'

        const style = {
            backgroundColor: backcolor,
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white'
        }
        return {
            style
        }
    }

    const onSelect = (event) => {
        setselectedEvento(event.id);
        setdisabled(true);

        setvalueForm({
            ...valueForm,
            nombre: event.title,
            encargado: event.encargado,
            fecha: event.start,
            estado: event.estado,
        });
        setVisible(true);
    }

    const onEditEvent = (event) => {
        setdisabled(false);
    }

    const cleanForm = () => {
        setvalueForm({
            ...valueForm,
            nombre: '',
            encargado: '',
            fecha: new Date(),
            estado: 'Programado',
            sillas: []
        });
        setdisabled(false);
        setVisible(false);
        setselectedEvento('');
    };

    const onSave = () => {
        console.log(valueForm);
        console.log(disabled);

        if (!disabled && !textValidator(selectedEvento)) {
            console.log('Saved');

            apiControlTeatro.post('evento', valueForm)
                .then((response) => {
                    if (response.status === 201) {
                        createToast(
                            'success',
                            'Confirmado',
                            'El registro fue creado correctamente'
                        );
                        let test = {
                            id: response.data._id,
                            title: response.data.nombre,
                            encargado: response.data.encargado,
                            teatro: response.data.teatros._id,
                            estado: response.data.estado,
                            start: addHours(response.data.fecha, 0),
                            end: addHours(valueForm.fecha, 2),
                        }

                        console.log(test);

                        setlistEventos([test, ...listEventos]);
                        setVisible(false);
                        cleanForm();
                    } else {
                        createToast(
                            'error',
                            'Error',
                            response.statusText,
                        );
                        console.log(response.data);
                        cleanForm();
                        setVisible(false);
                        return;
                    }
                })
                .catch((err) => {
                    createToast(
                        'error',
                        'Error',
                        'Ha ocurrido un error al intentar crear el registro'
                    );
                    console.log(err);
                    setVisible(false);
                    cleanForm();
                });
        } else {
            console.log('Edit');

            apiControlTeatro.put(`evento/${selectedEvento}`, valueForm)
                .then((response) => {

                    if (response.status === 202) {
                        createToast(
                            'success',
                            'Confirmado',
                            'El registro fue editado correctamente'
                        );

                        let test = {
                            id: response.data._id,
                            title: response.data.nombre,
                            encargado: response.data.encargado,
                            teatro: response.data.teatros._id,
                            estado: response.data.estado,
                            start: addHours(response.data.fecha, 0),
                            end: addHours(valueForm.fecha, 2),
                        }

                        console.log(test);

                        const eventoFiltrados = listEventos.filter((ev) => (ev.id !== selectedEvento));
                        setlistEventos([test, ...eventoFiltrados]);
                        setVisible(false);
                        cleanForm();
                    } else {
                        createToast(
                            'error',
                            'Error',
                            response.statusText,
                        );
                        setVisible(false);
                        cleanForm();
                        return;
                    }
                })
                .catch((err) => {
                    createToast(
                        'error',
                        'Error',
                        'Ha ocurrido un error al intentar crear el registro'
                    );
                    console.log(err);
                    setVisible(false);
                    cleanForm();
                });
        }
    };

    const footerContent = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={cleanForm} className="p-button-text" />
            {
                !disabled &&
                <Button label="Guardar" icon="pi pi-check" onClick={onSave} autoFocus />
            }
        </div>
    );

    const newEvent = () => {
        if (!textValidator(valueForm.teatros)) {
            createToast('error', 'Error', 'Debe seleccionar un teatro');
            return;
        }
        setVisible(true);
        setdisabled(false);

        // setvalueForm({
        //     nombre: '',
        //     encargado: '',
        //     teatros: '',
        //     fecha: new Date(),
        //     estado: 'Programado',
        //     sillas: []
        // });
    };


    return (
        <div>
            <Toast ref={toast} />
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <h1 style={{ textAlign: 'center', margin: '4px' }}>Calendario de eventos</h1>
                <div className="divTags">
                    <Tag value="Programado" severity="info" rounded></Tag>
                    <Tag value="Pendiente" severity="warning" rounded></Tag>
                    <Tag value="Cancelado" severity="danger" rounded></Tag>
                    <Tag value="Finalizado" severity="success" rounded></Tag>
                </div>
                <div className='divNuevoEvento'>
                    <div className="flex flex-column gap-2 input">
                        <label htmlFor="estado" style={{ fontWeight: 100 }}>Teatro</label>
                        <Dropdown
                            value={selectedTeatroId}
                            onChange={(e) => {
                                console.log(e);
                                let eventos = [];

                                apiControlTeatro.get(`evento/teatro/${e.value}`, '')
                                    .then(({ data }) => {
                                        console.log(data);
                                        data.forEach(element => {
                                            eventos.push({
                                                id: element._id,
                                                title: element.nombre,
                                                encargado: element.encargado,
                                                teatro: element.teatros._id,
                                                estado: element.estado,
                                                start: addHours(element.fecha, 0),
                                                end: addHours(element.fecha, 2),
                                            });
                                        });
                                        console.log(eventos);

                                        setlistEventos(eventos)
                                    })
                                    .catch((error) => {
                                        console.error('Error:', error);
                                        createToast('error', 'Error', 'No se pudo obtener los datos del teatro');
                                    });

                                setselectedTeatroId(e.value)

                                setvalueForm({
                                    ...valueForm,
                                    teatros: e.value
                                })
                            }}
                            options={listTeatro}
                            name="name"
                            optionLabel="name"
                            optionValue="code"
                            placeholder="Selecciona"
                            className="w-full md:w-25rem"
                        />
                    </div>
                    <div>
                        <Button label="Agregar nuevo Evento" icon="pi file-plus" severity="info" style={{ margin: '10px' }} onClick={newEvent} />
                    </div>
                </div>

                <div>
                    <Calendar
                        culture='es'
                        localizer={localizer}
                        events={listEventos}
                        startAccessor="start"
                        eventPropGetter={eventStyleGetter}
                        endAccessor="end"
                        style={{ height: '70vh', width: '80vw' }}
                        messages={getMessagesEs()}
                        components={{
                            event: CalendarEvent
                        }}
                        onSelectEvent={onSelect}
                    />
                </div>

            </div>
            <Dialog header="Datos sobre el evento" 
            visible={visible} 
            style={{ width: '30vw' }} 
            onHide={() => { 
                if (!visible) 
                    return; 
                setVisible(false); 
                cleanForm(); 
            }} 
                footer={footerContent}
            >
                <div className='form'>
                    {disabled &&
                        <Button label="Editar Evento" icon="pi pi-pencil" severity="info" style={{ margin: '10px' }} onClick={onEditEvent} />
                    }
                    <div className="flex flex-column gap-2 input">
                        <label htmlFor="nombre" style={{ fontWeight: 100 }}>Nombre</label>
                        <InputText
                            disabled={disabled}
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={valueForm.nombre}
                            onChange={(event) => handleChangeText(event, 'nombre')}
                            className="p-inputtext-sm"
                        />
                    </div>
                    <div className="flex flex-column gap-2 input">
                        <label htmlFor="encargado" style={{ fontWeight: 100 }}>Encargado</label>
                        <InputText
                            disabled={disabled}
                            type="text"
                            id="encargado"
                            name="encargado"
                            value={valueForm.encargado}
                            onChange={(event) => handleChangeText(event, 'encargado')}
                            className="p-inputtext-sm"
                        />
                    </div>
                    <div className="flex flex-column gap-2 input">
                        <label htmlFor="fecha" style={{ fontWeight: 100 }}>Fecha</label>
                        <DatePicker
                            disabled={disabled}
                            selected={valueForm.fecha}
                            onChange={(e) => {
                                setvalueForm({
                                    ...valueForm,
                                    fecha: e
                                })
                            }}
                            className="form-control"
                            dateFormat="Pp"
                            showTimeSelect
                            locale="es"
                            timeCaption="Hora"
                        />
                    </div>
                    {
                        selectedEvento &&
                        <div className="flex flex-column gap-2 input">
                            <label htmlFor="estado" style={{ fontWeight: 100 }}>Estado</label>
                            <Dropdown value={valueForm.estado}
                                disabled={disabled}
                                onChange={(e) => setvalueForm({ ...valueForm, estado: e.value })}
                                options={estados} optionLabel="estado"
                                placeholder="Selecciona"
                                className="w-full md:w-14rem" />
                        </div>
                    }
                    <br />
                </div>
            </Dialog>
        </div>
    )
}
