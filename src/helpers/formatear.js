import { format } from 'date-fns';

export const formatearFecha = ( date )=>{        
    //const fecha = subHours( date,18)
    return  format(date, 'yyyy-MM-dd HH:mm a');
}