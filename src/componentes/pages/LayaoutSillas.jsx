import React, { useEffect, useRef, useState } from 'react'
import { Checkbox, Button, Dropdown, Toast } from "primereact";

import { apiControlTeatro } from '../../service/apiControlTeatro';
import './LayaoutSillasStyle.css'
import { textValidator } from '../../helpers/validator';
import Select from 'react-select';


//document.body.style.zoom = '90%';
export const LayaoutSillas = () => {
  const [listTeatros, setlistTeatros] = useState([{
    id: '',
    nombre: '',
    cantSillas: 0,
    sillas: []
  }]);
  const [eventoOptions, setEventoOptions] = useState([]);
  const [eventoOptionsFilter, setEventoOptionsFilter] = useState([]);
  const [listEventos, setlistEventos] = useState([]);
  const [selectedEvento, setselectedEvento] = useState('');
  const [selectedEventoId, setselectedEventoId] = useState('');
  const [teatroSeleccionado, setteatroSelecionado] = useState('');
  const [listTeatrosSelect, setlistTeatrosSelect] = useState([{ name: '', code: '' }]);
  const [cantSillas, setcantSillas] = useState(0);
  const [selectedSilla, setSelectedSilla] = useState([]);
  const toast = useRef(null);

  const createToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 8000 });
  };
  useEffect(() => {
    let sillas = [{}];
    let eventos = [];
    let teatroSelect = [];

    apiControlTeatro.get('teatro', '').then(({ data }) => {
      let teatros = []

      data.forEach(element => {
        let datos = element.sillas.sort((a, b) => b.fila.localeCompare(a.fila));
        let asientos = [];
        let cantAsientos = 0;
        let fila = '';
        for (let x = 0; x < datos.length; x++) {
          for (let z = 1; z <= datos[x].numSillas; z++) {
            asientos.push(`${z}`);
            fila = datos[x].fila;
          }
          sillas[x] = {
            sillas: asientos.sort((a, b) => b - a),
            fila: fila,
          }
          cantAsientos += asientos.length
          asientos = [];
        }
        teatroSelect.push({
          name: element.nombre,
          code: element._id
        });

        teatros.push({
          id: element._id,
          nombre: element.nombre,
          cantSillas: cantAsientos,
          sillas
        });
        sillas = [{}];
      });
      setlistTeatros(teatros);
      setlistTeatrosSelect(teatroSelect);
    })

    apiControlTeatro.get('/evento/programado', '').then(({ data }) => {
      console.log(data);
      setlistEventos(data);
      data.forEach(e => {
        eventos.push({
          label: e.nombre,
          value: e._id,
          teatro: e.teatros._id
        });
      });
      setEventoOptions(eventos);
    });
    clean();
  }, []);

  const clean = () => {
    setSelectedSilla([]);
    setselectedEvento('');
    setselectedEventoId('');
    setteatroSelecionado('');
    //setEventoOptions([]);
    setEventoOptionsFilter([]);
    setcantSillas(0);

    apiControlTeatro.get('/evento/programado', '').then(({ data }) => {
      setlistEventos(data);
    });
  };

  const onSillaChange = (e) => {
    let _sillas = [...selectedSilla];

    if (e.checked)
      _sillas.push(e.value);
    else
      _sillas.splice(_sillas.indexOf(e.value), 1);

    setSelectedSilla(_sillas);
  }

  const guardarAsientos = () => {

    if (!textValidator(selectedEvento)) {
      createToast(
        'warn',
        'Error',
        'Debe seleccionar un evento'
      );
      return;
    }
    apiControlTeatro.put(`/evento/${selectedEventoId}`,
      {
        sillas: selectedSilla,
      })
      .then((response) => {
        console.log(response);

        if (response.status === 202) {
          let eventoFilter = listEventos.filter(evento => evento._id !== selectedEventoId);
          setlistEventos([...eventoFilter, response.data]);

          createToast(
            'success',
            'Confirmado',
            'Selección de sillas guardado exitosamente'
          );
        } else {
          createToast(
            'error',
            'Error',
            response.statusText,
          );
          clean();
          return;
        }
      })
      .catch((err) => {
        createToast(
          'error',
          'Error',
          'Ha ocurrido un error al intentar guardar selección'
        );
        console.log(err);
        clean();
      });
  }

  const onChangeEvento = (e) => {
    setselectedEvento(e.label);
    setselectedEventoId(e.value);
    let sillas = listEventos.filter(x => x._id === e.value);
    console.log(sillas);

    setSelectedSilla(sillas[0].sillas);
  };

  return (
    <>
      <Toast ref={toast} />
      <br />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div className='divSelect'>
          <label htmlFor="estado" style={{ fontWeight: 100 }}>Teatro</label>
          <Dropdown
            value={teatroSeleccionado}
            onChange={(e) => {

              let eventos = eventoOptions.filter((evento) => evento.teatro === e.value);
              setEventoOptionsFilter(eventos);
              let teatroFiltro = listTeatros.filter((t) => t.id === e.value ? t.cantSillas : 0);

              setcantSillas(teatroFiltro[0].cantSillas);
              setteatroSelecionado(e.value);
            }}
            options={listTeatrosSelect}
            optionLabel="name"
            optionValue="code"
            placeholder="Selecciona"
            className="w-full md:w-25rem" />
        </div>
        <div className='divSelect'>
          <label htmlFor="evento" style={{ fontWeight: 100 }}>Evento</label>
          <Select
            onChange={(e) => {
              console.log(e);
              onChangeEvento(e);
            }}
            options={eventoOptionsFilter}
            className="w-full md:w-25rem"
          />
        </div>
        <div>
          <Button label="Guardar" severity="info" onClick={guardarAsientos} />
        </div>
        <div>
          <Button label="Limpiar" severity="warning" onClick={clean} />
        </div>
        <div>
          <p className='pDatoSillas' >
            <span style={{ fontWeight: 100 }}>Sillas vendidas: </span>
            <span className='pValorSillas'> {selectedSilla.length} </span>
          </p>
          <p className='pDatoSillas'>
            <span style={{ fontWeight: 100 }}>Sillas disponibles: </span>
            <span className='pValorSillas'> {cantSillas - selectedSilla.length}</span>
          </p>
        </div>
      </div>
      <br />
      <h1 className='titulo' color='#000000'>{selectedEvento}</h1>
      {
        listTeatros.filter(t => t.id === teatroSeleccionado).map((teatro) => (
          <div key={teatro.id}>
            <h1 className='titulo' style={{ color: '#000000' }}>{teatro.nombre}</h1>
            <h1 className='titulo' style={{ color: '#767676' }}>Back</h1>
            <div>
              {
                teatro.sillas.map((fila) => (
                  <div className='teatro'>
                    <p className='letraDerecha'>{fila.fila}</p>
                    {
                      fila.sillas.map(silla => (
                        <div key={`${fila.fila}${silla}`}
                          className={`asiento ${selectedSilla.includes(`${fila.fila}${silla}`) ?
                            "asiento-reservado" : "asiento-disponible"}`}>
                          <Checkbox
                            inputId={`${fila.fila}${silla}`}
                            onChange={onSillaChange}
                            checked={selectedSilla.includes(`${fila.fila}${silla}`)}
                            value={`${fila.fila}${silla}`}
                          />
                          <p style={{ fontWeight: 900 }}>{silla}</p>
                        </div>
                      ))
                    }
                    <p className='letraIzquierda'>{fila.fila}</p>
                  </div>
                ))
              }
              <h1 className='titulo' style={{ color: '#767676' }}>Front</h1>
            </div>
          </div>

        ))}
    </>
  )

}
