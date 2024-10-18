import { format } from 'date-fns';

export const formatearFecha = ( date )=>{        
    //const fecha = addHours( date.ultimaCita,6)
    return  format(date, 'yyyy-MM-dd');
}