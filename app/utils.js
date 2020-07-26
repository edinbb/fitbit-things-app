import { preferences, units } from "user-settings";

const monthsShort = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]; 

export function formatDate(dateStr) {
  if (dateStr === null) return;
  let date, ret;
  try {
    date = new Date(dateStr);
  } catch(err) {
    console.error(err);
    return;
  }

  let day = zeroPad(date.getDate());
  let mo = monthsShort[date.getMonth()];
  let time = getTime(date);
  ret = units.distance === "us" ? `${mo} ${day}, ${time}` : `${day} ${mo}, ${time}`;
  return "L. run - " + ret;
}

export function getTime(date) {
  let hours = date.getHours();
  let mins = zeroPad(date.getMinutes());
  let ampm = hours >= 12 ? "pm" : "am";
  
  hours = preferences.clockDisplay === "12h" ? hours % 12 || 12 : zeroPad(hours);
  ampm = preferences.clockDisplay === "12h" ? ampm : "";
  
  return `${hours}:${mins} ${ampm}`;
}

function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}