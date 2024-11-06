import React, { useEffect, useRef, useState } from 'react'
import {
  DataTable, Column, Tag, Dropdown,
  FilterMatchMode, Toast
} from "primereact";

import { apiControlTeatro } from '../../service/apiControlTeatro'
import './EventoStyle.css'
import { formatearFecha } from '../../helpers/formatear';
import { textValidator } from '../../helpers/validator';

import { registerLocale } from "react-datepicker";
import { es } from 'date-fns/locale/es';
registerLocale('es', es)

//document.body.style.zoom = '90%';
export const Evento = () => {
  const [listEventos, setlistEventos] = useState([]);
  const [selectedEvento, setselectedEvento] = useState(null);
  const [listTeatro, setlistTeatro] = useState([{ name: '', code: '' }]);
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
    apiControlTeatro.get('teatro', '').then(({ data }) => {
      data.forEach(element => {
        teatro.push({
          name: element.nombre,
          code: element._id
        });
      });
      setlistTeatro(teatro);
    });
    apiControlTeatro.get('evento', '').then(({ data }) => {
      console.log(data);

      setlistEventos(data)
    })
    cleanForm();
  }, []);

  const [statuses] = useState(['Cancelado', 'Finalizado']);

  const getSeverity = (status) => {
    switch (status) {
      case 'Cancelado':
        return 'danger';

      case 'Finalizado':
        return 'success';

    }
  };

  const statusItemTemplate = (option) => {
    return <Tag value={option}
    //severity={getSeverity(option)}
    />;
  };

  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
    );
  };

  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.status}
    //severity={getSeverity(rowData.status)} 
    />;
  };

  const cleanForm = () => {
    setvalueForm({
      nombre: '',
      encargado: '',
      teatros: '',
      fecha: new Date(),
      estado: 'Programado',
      sillas: []
    });
    setselectedEvento('');
  };

  const onSave = () => {
    if (!textValidator(valueForm.encargado) ||
      !textValidator(valueForm.nombre) ||
      !textValidator(valueForm.fecha) ||
      !textValidator(valueForm.teatros)) {
      createToast(
        'warn',
        'Acción requerida',
        'Por favor ingrese todos los datos'
      );
      return;
    }

    if (textValidator(selectedEvento)) {
      apiControlTeatro.put(`evento/${selectedEvento}`, valueForm)
        .then((response) => {

          if (response.status === 202) {
            createToast(
              'success',
              'Confirmado',
              'El registro fue editado correctamente'
            );
            const eventoFiltrados = listEventos.filter((ev) => (ev._id !== selectedEvento));
            setlistEventos([response.data, ...eventoFiltrados]);
            cleanForm();
          } else {
            createToast(
              'error',
              'Error',
              response.statusText,
            );
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
          cleanForm();
        });
    } else {
      apiControlTeatro.post('evento', valueForm)
        .then((response) => {
          if (response.status === 201) {
            createToast(
              'success',
              'Confirmado',
              'El registro fue creado correctamente'
            );
            setlistEventos([response.data, ...listEventos]);
            cleanForm();
          } else {
            createToast(
              'error',
              'Error',
              response.statusText,
            );
            console.log(response.data);
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
          cleanForm();
        });
    }

  };

  const onCellSelect = (event) => {
    if (event.cellIndex === 0) {
      setselectedEvento(event.rowData._id);

      setvalueForm({
        nombre: event.rowData.nombre,
        encargado: event.rowData.encargado,
        teatros: event.rowData.teatros._id,
        fecha: new Date(event.rowData.fecha),
        estado: event.rowData.estado,
      })
    }
  };

  const renderEditButton = () => {
    return (
      <i className="pi pi-pencil" style={{ color: 'slateblue' }}></i>
    );
  };

  const [filters] = useState({
    nombre: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
    encargado: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
    'teatros.nombre': { value: '', matchMode: FilterMatchMode.STARTS_WITH },
    estado: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
  });

  const fechaBodyTemplate = (fecha) => {
    return formatearFecha(fecha);
  };

  const handleChangeText = ({ target }, select) => {
    setvalueForm({
      ...valueForm,
      [select]: target.value
    })
  };

  return (
    <>
      <Toast ref={toast} />
      <h1 style={{ textAlign: 'center' }}>Lista de Eventos</h1>
      <br />
      <div style={{
        width: '85%',
        margin: '0 auto',
      }}>
        <DataTable value={listEventos}
          showGridlines
          stripedRows
          size="small"
          sortMode="multiple"
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 30, 40, 50]}
          filters={filters}
          filterDisplay='row'
          selectionMode="single"
          selection={setselectedEvento}
          cellSelection
          onCellSelect={onCellSelect}
          scrollable
          columnResizeMode="expand"
          resizableColumns
        >
          <Column body={renderEditButton} style={{ textAlign: 'center' }}></Column>
          <Column field="nombre" header="Nombre" sortable filter ></Column>
          <Column field="teatros.nombre" header="Teatro" filter ></Column>
          <Column field="encargado" header="Encargado" filter ></Column>
          <Column field="fecha" header="Fecha" body={(data) => fechaBodyTemplate(data.fecha)}></Column>
          <Column field="estado" header="Estado" filter></Column>
        </DataTable>
      </div>
      {/* <div>
          <h1 style={{ textAlign: 'center' }}>Datos sobre el evento</h1>
          <div className='form'>
            <div className="flex flex-column gap-2 input">
              <label htmlFor="nombre" style={{ fontWeight: 100 }}>Nombre</label>
              <InputText
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
                type="text"
                id="encargado"
                name="encargado"
                value={valueForm.encargado}
                onChange={(event) => handleChangeText(event, 'encargado')}
                className="p-inputtext-sm"
              />
            </div>
            <div className="flex flex-column gap-2 input">
              <label htmlFor="estado" style={{ fontWeight: 100 }}>Teatro</label>
              <Dropdown value={valueForm.teatros}
                onChange={(e) => {
                  setvalueForm({
                    ...valueForm,
                    teatros: e.value
                  })
                }}
                options={listTeatro}
                optionLabel="name"
                optionValue="code"
                placeholder="Selecciona"
                className="w-full md:w-25rem" />
            </div>
            <div className="flex flex-column gap-2 input">
              <label htmlFor="fecha" style={{ fontWeight: 100 }}>Fecha</label>
              <DatePicker
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
                  onChange={(e) => setvalueForm({ ...valueForm, estado: e.value })}
                  options={estados} optionLabel="estado"
                  placeholder="Selecciona"
                  className="w-full md:w-14rem" />
              </div>
            }
            <br />
            <br />
            <br />
            <div>
              <Button label="Cancelar" severity="info" onClick={cleanForm} outlined style={{ margin: '10px' }} />
              <Button label="Guardar" icon="pi file-plus" severity="info" style={{ margin: '10px' }} onClick={onSave} />

            </div>

          </div>
        </div> */}
    </>
  )
}
