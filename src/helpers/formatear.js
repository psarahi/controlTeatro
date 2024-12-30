import dayjs from "dayjs";
export const formatearFecha = ( date )=>{        
    return dayjs(date).format("YYYY-MM-DD HH:mm");
}