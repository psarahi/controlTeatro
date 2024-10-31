import React, { useEffect, useRef, useState } from 'react'
import {
  Button, DataTable, Column,
  FilterMatchMode, InputText, Toast,
  confirmDialog, ConfirmDialog, Chip, Dropdown
} from "primereact";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

import { apiControlTeatro } from '../../service/apiControlTeatro'
import './EventoStyle.css'
import { formatearFecha } from '../../helpers/formatear';
import { textValidator } from '../../helpers/validator';

export const Evento = () => {
  const [listEventos, setlistEventos] = useState([]);
  const [selectedEvento, setselectedEvento] = useState(null);
  const [valueForm, setvalueForm] = useState({
    nombre: '',
    encargado: '',
    fecha: new Date(),
    estado: 'Programado',
    sillas: []
  });
  let idEvento = '';
  const [disabled, setdisabled] = useState(false);
  const estados = ['Programado', 'Finalizado'];

  const toast = useRef(null);

  const createToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 6000 });
  };

  useEffect(() => {
    apiControlTeatro.get('evento', '').then(({ data }) => {
      setlistEventos(data)
    })
    cleanForm();
  }, [])

  const cleanForm = () => {
    setvalueForm({
      nombre: '',
      encargado: '',
      fecha: new Date(),
      estado: 'Programado',
      sillas: []
    });
    idEvento = '';
    setselectedEvento('');
  };

  const onSave = () => {
    if (!textValidator(valueForm.encargado) || !textValidator(valueForm.nombre) || !textValidator(valueForm.fecha)) {
      createToast(
        'warn',
        'Acción requerida',
        'Por favor ingrese todos los datos'
      );
      return;
    }

    if (textValidator(idEvento)) {
      apiControlTeatro.put(`evento/${idEvento}`, valueForm)
        .then((response) => {

          if (response.status === 202) {
            createToast(
              'success',
              'Confirmado',
              'El registro fue editado correctamente'
            );
            const eventoFiltrados = listEventos.filter((ev) => (ev._id !== idEvento));
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
    idEvento = event.rowData._id;
    setselectedEvento(event.rowData._id);
    if (event.cellIndex === 0) {
      setdisabled(false);
      setvalueForm({
        nombre: event.rowData.nombre,
        encargado: event.rowData.encargado,
        fecha: new Date(event.rowData.fecha),
        estado: event.rowData.estado,
      })
    }
    if (event.cellIndex === 1) {
      setdisabled(false);
      handleDelete();
    }
    if (event.cellIndex === 2) {
      setdisabled(true);
      setvalueForm({
        nombre: event.rowData.nombre,
        encargado: event.rowData.encargado,
        fecha: new Date(event.rowData.fecha),
        estado: event.rowData.estado,
      })
    }
  };

  const handleDelete = () => {
    confirmDialog({
      message: `¿Desea eliminar el registro? `,
      header: 'Eliminar',
      icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      accept: acceptDialog,
      reject: rejectDialog
    });
  };

  const acceptDialog = () => {
    if (textValidator(idEvento)) {
      apiControlTeatro.delete(`evento/${idEvento}`)
        .then((response) => {
          if (response.status === 200) {
            createToast(
              'success',
              'Confirmado',
              'El registro a sido eliminado'
            );
            const eventoFiltrado = listEventos.filter((ev) => (ev._id !== idEvento));
            setlistEventos([...eventoFiltrado]);
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
    } else {
      createToast(
        'warn',
        'Acction requerida',
        'No se selecciono el inventario correctamente'
      );
    }
  }

  const rejectDialog = () => {
    createToast(
      'warn',
      'Cancelado',
      'Acción cancelada'
    );
  }

  const renderEditButton = () => {
    return (
      <i className="pi pi-pencil" style={{ color: 'slateblue' }}></i>
    );
  };

  const renderDeleteButton = (value) => {
    return (
      <i className="pi pi-trash" style={{ color: 'red' }}></i>);
  };

  const renderEstadoButton = (value) => {
    return (
      <Chip label="Cambiar estado" />)
  };

  const [filters] = useState({
    nombre: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
    encargado: { value: '', matchMode: FilterMatchMode.STARTS_WITH },
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
      <ConfirmDialog />
      <h1 style={{ textAlign: 'center' }}>Lista de Eventos</h1>
      <br />
      <div className='container'>
        <DataTable value={listEventos}
          showGridlines
          stripedRows
          sortMode="multiple"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 20, 30, 40, 50]}
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
          <Column body={renderDeleteButton} style={{ textAlign: 'center' }}></Column>
          <Column body={renderEstadoButton} style={{ textAlign: 'center' }}></Column>
          <Column field="nombre" header="Nombre" sortable filter ></Column>
          <Column field="encargado" header="Encargado" filter ></Column>
          <Column field="fecha" header="Fecha" body={(data) => fechaBodyTemplate(data.fecha)}></Column>
          <Column field="estado" header="Estado" filter></Column>
        </DataTable>
        <div>
          <h1 style={{ textAlign: 'center' }}>Datos sobre el evento</h1>
          <div className='form'>
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
            <DatePicker
              disabled={disabled}
              onChange={(e) => {
                setvalueForm({
                  ...valueForm,
                  fecha: e
                })
              }
              }
              value={valueForm.fecha}
              format='dd-MM-y'
            />
            {
              disabled &&
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
        </div>
      </div>
    </>
  )
}
