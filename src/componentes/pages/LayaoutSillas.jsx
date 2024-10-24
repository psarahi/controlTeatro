import React, { useEffect, useRef, useState } from 'react'
import { Checkbox, Button, Dropdown, Toast } from "primereact";

import { apiControlTeatro } from '../../service/apiControlTeatro';
import './LayaoutSillasStyle.css'
import { textValidator } from '../../helpers/validator';

export const LayaoutSillas = () => {
  const [listSillas, setlistSillas] = useState([]);
  const [eventoOptions, setEventoOptions] = useState([]);
  const [listEventos, setlistEventos] = useState([]);
  const [selectedEvento, setselectedEvento] = useState('');
  const [selectedSilla, setSelectedSilla] = useState([
    // 'A1', 'A2', 'A3', 'A4', 'A5',
    // 'B1', 'B2', 'B3', 'B4', 'B5',
    // 'C1', 'C2', 'C3', 'C4', 'C5',
    // 'D1', 'D2', 'D3', 'D4', 'D5',
    // 'E1', 'E2', 'E3', 'E4', 'E5',
  ]);
  const toast = useRef(null);

  const createToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 8000 });
  };
  useEffect(() => {
    let sillas = [{}];
    let eventos = [];

    apiControlTeatro.get('silla', '').then(({ data }) => {
      let datos = data.sort((a, b) => b.fila.localeCompare(a.fila));
      let asientos = [];
      let fila = '';
      for (let x = 0; x < datos.length; x++) {
        for (let z = 1; z <= datos[x].numSillas; z++) {
          // if (z === 1) { asientos.push(`${datos[x].fila}`) };
          asientos.push(`${z}`);
          fila = datos[x].fila;
          // if (z === datos[x].numSillas) { asientos.push(`${datos[x].fila}`) };
          //console.log(isNaN(asientos[z]));
        }
        sillas[x] = {
          sillas: asientos.sort((a, b) => b - a),
          fila: fila,
        }
        asientos = [];
      }
      setlistSillas(sillas);

      console.log(sillas);

    })

    apiControlTeatro.get('/evento/programado', '').then(({ data }) => {
      console.log(data);
      setlistEventos(data);
      data.forEach(e => {
        eventos.push(e.nombre);
      });
      setEventoOptions(eventos);
    });

    //apiControlTeatro.get
    clean();
  }, []);

  const clean = () => {
    setSelectedSilla([]);
    setselectedEvento('');

    apiControlTeatro.get('/evento/programado', '').then(({ data }) => {
      setlistEventos(data);
    });
  };

  const onSillaChange = (e) => {
    console.log(e);

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
    apiControlTeatro.put(`/evento/nombre`,
      {
        nombre: selectedEvento,
        sillas: selectedSilla,
      })
      .then((response) => {
        console.log(response);
        
        if (response.status === 202) {
       let eventoFilter = listEventos.filter(evento => evento.nombre !== selectedEvento);
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
          return;
          clean();
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
    setselectedEvento(e.value);
    let silla = listEventos.filter(x => x.nombre === e.value);
    setSelectedSilla(silla[0].sillas);
  };

  return (
    <>
      <Toast ref={toast} />
      <br />
      <div className="card flex justify-content-center" style={{ gap: '15px' }}>
        <Dropdown
          value={selectedEvento}
          onChange={(e) => onChangeEvento(e)}
          options={eventoOptions}
          optionLabel="nombre"
          placeholder="Selecciona evento"
          className="w-full md:w-25rem" />
        <Button label="Guardar" severity="info" onClick={guardarAsientos} />
        <Button label="Limpiar" severity="warning" onClick={clean} />
      </div>
      <h1 className='titulo'>Front</h1>
      {
        listSillas.map((fila) => (
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
      <h1 className='titulo'>In</h1>
    </>
  )
}
