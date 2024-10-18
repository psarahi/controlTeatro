import React, { useEffect, useState } from 'react'
import { Checkbox, Button } from "primereact";

import { apiControlTeatro } from '../../service/apiControlTeatro';
import './LayaoutSillasStyle.css'

export const LayaoutSillas = () => {
  const [listSillas, setlistSillas] = useState([])
  const [checked, setChecked] = useState(false);
  let sillas = [{}];

  useEffect(() => {
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
    cleanForm();
  }, [])

  const cleanForm = () => { };

  return (
    <>
      <h1 className='titulo'>Front</h1>
      {
        listSillas.map((fila) => (
          <div className='teatro'>
            <p className='letraDerecha'>{fila.fila}</p>
            {
              fila.sillas.map(silla => (
                <div key={silla} className='asiento asiento-disponible'>
                  <Checkbox
                    id={`${silla}${fila.fila}`}
                    onChange={e => {
                      console.log(e);

                      setChecked(e.checked)
                    }}
                    checked={checked}>

                  </Checkbox>
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
