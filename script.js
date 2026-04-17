const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let lunch = 0;

setInterval(updateTime, 500);

function updateTime() {
  data = getCurrent();
  // day, month, date, dayNum, year, hours, mins, secs, name, end, nextName, nextStart
  let abbr = "th";
  let dayNum = Number(data[2]);
  if(dayNum >= 4 && dayNum <= 20) abbr = "th";
  else if(dayNum % 10 == 1) abbr = "st";
  else if(dayNum % 10 == 2) abbr = "nd";
  else if(dayNum % 10 == 3) abbr = "rd";
  document.getElementById("day").innerHTML = data[0];
  document.getElementById("date").innerHTML = data[1] + " " + data[2] + abbr + ", " + data[3];
  document.getElementById("time").innerHTML = data[4] + ":" + data[5] + ":" + data[6];
  document.getElementById("current").innerHTML = data[7];
  document.getElementById("end").innerHTML = data[8];
  document.getElementById("next").innerHTML = data[9];
  document.getElementById("start").innerHTML = data[10];
  document.getElementById("timeRemaining").innerHTML = data[11];
  let result = "LUNCH: <b><u>A</u></b> B C";
  if(lunch == 1) result = "LUNCH: A <b><u>B</u></b> C";
  else if(lunch == 2) result = "LUNCH: A B <b><u>C</u></b>";
  document.getElementById("lunch").innerHTML = result;
}

function updateLunch() {
  lunch = lunch + 1;
  lunch = lunch % 3;
}

class Period {
  constructor(name, start, end) {
    this.name = name;
    this.start = start;
    this.end = end;
  }

  formatDate(date) {
    return `${(date.getHours() % 12 || 12).toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  getStartAsDate() {
    return this.start;
  }

  getEndAsDate() {
    return this.end;
  }

  getStart() {
    return `${(this.start.getHours() % 12 || 12).toString().padStart(2, '0')}:${this.start.getMinutes().toString().padStart(2, '0')}`;
  }

  getEnd() {
    return `${(this.end.getHours() % 12 || 12).toString().padStart(2, '0')}:${this.end.getMinutes().toString().padStart(2, '0')}`;
  }

  toString() {
    return this.name + " " + this.formatDate(this.start) + " " + this.formatDate(this.end);
  }
}

function getCurrent() {
  // day, month, date, dayNum, year, hours, mins, secs, name, end, nextName, nextStart
  let date = new Date();
  let periods = getPeriods();

  let dayNum = date.getDay();
  let day = days[date.getDay()];
  let month = months[date.getMonth()];
  let dateNum = date.getDate();
  let hours = (date.getHours() % 12 || 12).toString().padStart(2, '0');
  let mins = date.getMinutes().toString().padStart(2, '0');
  let secs = date.getSeconds().toString().padStart(2, '0');
  let year = date.getFullYear();
  let name = '';
  let end = '';
  let nextName = '';
  let nextStart = '';
  let timeRemaining = '';

  let result = [day, month, dateNum, year, hours, mins, secs, name, end, nextName, nextStart, timeRemaining];

  if(dayNum == 0 || dayNum == 6) {
    return result;
  }

  if(date < periods[0].start) {
    result[7] = "Before School";
    result[8] = periods[0].getStart();
    result[9] = periods[0].name;
    result[10] = periods[0].getStart();
    result[11] = msToTime(periods[0].getStartAsDate() - date);
    return result;
  }

  if(date > periods[periods.length - 1].end) {
    result[7] = "After School";
    return result;
  }

  for(let i = 0; i < periods.length; i++) {
    // class period
    if(date > periods[i].start && date < periods[i].end) {
      result[7] = periods[i].name;
      result[8] = periods[i].getEnd();
      if(i < periods.length - 1) {
        result[9] = periods[i + 1].name;
        result[10] = periods[i + 1].getStart();
      }
      result[11] = msToTime(periods[i].getEndAsDate() - date);
      return result;
    }
    // passing period
    if(i < periods.length - 1 && date > periods[i].end && date < periods[i + 1].start) {
      result[7] = "Passing Period";
      result[8] = periods[i + 1].getStart();
      result[9] = periods[i + 1].name;
      result[10] = periods[i + 1].getStart();
      result[11] = msToTime(periods[i+1].getStartAsDate() - date);
      return result;
    }
  }

  return result;
}

function msToTime(ms) {
  let seconds = Math.floor((ms / 1000) % 60);
  let minutes = Math.floor((ms / 1000 / 60) % 60);
  let hours = Math.floor((ms  / 1000 / 3600 ) % 24);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function getPeriods() {
  date = new Date();
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');
  let year = date.getFullYear();
  let periods = []

  let dayNum = date.getDay();

  let name = '';
  let start = null;
  let end = null;
  if(dayNum == 1 || dayNum == 5) {
    // Monday Friday
    name = "Period 1"
    start = new Date(`${year}-${month}-${day}T08:00:00`);
    end = new Date(`${year}-${month}-${day}T08:43:00`);
    periods.push(new Period(name, start, end));

    name = "Period 2"
    start = new Date(`${year}-${month}-${day}T08:48:00`);
    end = new Date(`${year}-${month}-${day}T09:31:00`);
    periods.push(new Period(name, start, end));

    name = "Glenbard Hour"
    start = new Date(`${year}-${month}-${day}T09:34:00`);
    end = new Date(`${year}-${month}-${day}T10:14:00`);
    periods.push(new Period(name, start, end));

    name = "Period 3"
    start = new Date(`${year}-${month}-${day}T10:17:00`);
    end = new Date(`${year}-${month}-${day}T11:00:00`);
    periods.push(new Period(name, start, end));
    
    name = "Period 4"
    start = new Date(`${year}-${month}-${day}T11:05:00`);
    end = new Date(`${year}-${month}-${day}T11:48:00`);
    periods.push(new Period(name, start, end));

    name = "Period 5"
    start = new Date(`${year}-${month}-${day}T11:53:00`);
    end = new Date(`${year}-${month}-${day}T12:36:00`);
    periods.push(new Period(name, start, end));
    
    name = "Period 6"
    start = new Date(`${year}-${month}-${day}T12:41:00`);
    end = new Date(`${year}-${month}-${day}T13:24:00`);
    periods.push(new Period(name, start, end));

    name = "Period 7"
    start = new Date(`${year}-${month}-${day}T13:29:00`);
    end = new Date(`${year}-${month}-${day}T14:12:00`);
    periods.push(new Period(name, start, end));
    
    name = "Period 8"
    start = new Date(`${year}-${month}-${day}T14:17:00`);
    end = new Date(`${year}-${month}-${day}T15:00:00`);
    periods.push(new Period(name, start, end));
  } else if(dayNum == 2) {
    // Tuesday
    name = "Period 1"
    start = new Date(`${year}-${month}-${day}T08:00:00`);
    end = new Date(`${year}-${month}-${day}T08:43:00`);
    periods.push(new Period(name, start, end));

    name = "Period 2"
    start = new Date(`${year}-${month}-${day}T08:48:00`);
    end = new Date(`${year}-${month}-${day}T09:31:00`);
    periods.push(new Period(name, start, end));

    name = "Period 3"
    start = new Date(`${year}-${month}-${day}T09:36:00`);
    end = new Date(`${year}-${month}-${day}T10:19:00`);
    periods.push(new Period(name, start, end));

    name = "Period 4"
    start = new Date(`${year}-${month}-${day}T10:24:00`);
    end = new Date(`${year}-${month}-${day}T11:07:00`);
    periods.push(new Period(name, start, end));
    
    name = "Period 5"
    start = new Date(`${year}-${month}-${day}T11:12:00`);
    end = new Date(`${year}-${month}-${day}T11:55:00`);
    periods.push(new Period(name, start, end));

    name = "Period 6"
    start = new Date(`${year}-${month}-${day}T12:00:00`);
    end = new Date(`${year}-${month}-${day}T12:43:00`);
    periods.push(new Period(name, start, end));
    
    name = "Period 7"
    start = new Date(`${year}-${month}-${day}T12:48:00`);
    end = new Date(`${year}-${month}-${day}T13:31:00`);
    periods.push(new Period(name, start, end));

    name = "Period 8"
    start = new Date(`${year}-${month}-${day}T13:36:00`);
    end = new Date(`${year}-${month}-${day}T14:19:00`);
    periods.push(new Period(name, start, end));
    
    name = "PLC"
    start = new Date(`${year}-${month}-${day}T14:23:00`);
    end = new Date(`${year}-${month}-${day}T15:05:00`);
    periods.push(new Period(name, start, end));
  } else if(dayNum == 3) {
    // Wednesday
    name = "Period 1"
    start = new Date(`${year}-${month}-${day}T08:00:00`);
    end = new Date(`${year}-${month}-${day}T09:30:00`);
    periods.push(new Period(name, start, end));

    name = "Period 3"
    start = new Date(`${year}-${month}-${day}T09:35:00`);
    end = new Date(`${year}-${month}-${day}T11:05:00`);
    periods.push(new Period(name, start, end));

    if(lunch == 0) {
      name = "Lunch 7A"
      start = new Date(`${year}-${month}-${day}T11:10:00`);
      end = new Date(`${year}-${month}-${day}T11:50:00`);
      periods.push(new Period(name, start, end));

      name = "Period 7A"
      start = new Date(`${year}-${month}-${day}T11:55:00`);
      end = new Date(`${year}-${month}-${day}T13:25:00`);
      periods.push(new Period(name, start, end));
    } else if(lunch == 1) {
      name = "Period 7B"
      start = new Date(`${year}-${month}-${day}T11:10:00`);
      end = new Date(`${year}-${month}-${day}T11:55:00`);
      periods.push(new Period(name, start, end));

      name = "Lunch 7B"
      start = new Date(`${year}-${month}-${day}T11:58:00`);
      end = new Date(`${year}-${month}-${day}T12:38:00`);
      periods.push(new Period(name, start, end));

      name = "Period 7B"
      start = new Date(`${year}-${month}-${day}T12:41:00`);
      end = new Date(`${year}-${month}-${day}T13:25:00`);
      periods.push(new Period(name, start, end));
    } else {
      name = "Period 7C"
      start = new Date(`${year}-${month}-${day}T11:10:00`);
      end = new Date(`${year}-${month}-${day}T12:40:00`);
      periods.push(new Period(name, start, end));

      name = "Lunch 7C"
      start = new Date(`${year}-${month}-${day}T12:45:00`);
      end = new Date(`${year}-${month}-${day}T13:25:00`);
      periods.push(new Period(name, start, end));
    }

    name = "Period 5"
    start = new Date(`${year}-${month}-${day}T13:30:00`);
    end = new Date(`${year}-${month}-${day}T15:00:00`);
    periods.push(new Period(name, start, end));
  } else {
    // Thursday
    name = "Period 4"
    start = new Date(`${year}-${month}-${day}T08:00:00`);
    end = new Date(`${year}-${month}-${day}T09:30:00`);
    periods.push(new Period(name, start, end));

    name = "Period 2"
    start = new Date(`${year}-${month}-${day}T09:35:00`);
    end = new Date(`${year}-${month}-${day}T11:05:00`);
    periods.push(new Period(name, start, end));

    if(lunch == 0) {
      name = "Lunch 8A"
      start = new Date(`${year}-${month}-${day}T11:10:00`);
      end = new Date(`${year}-${month}-${day}T11:50:00`);
      periods.push(new Period(name, start, end));

      name = "Period 8A"
      start = new Date(`${year}-${month}-${day}T11:55:00`);
      end = new Date(`${year}-${month}-${day}T13:25:00`);
      periods.push(new Period(name, start, end));
    } else if(lunch == 1) {
      name = "Period 8B"
      start = new Date(`${year}-${month}-${day}T11:10:00`);
      end = new Date(`${year}-${month}-${day}T11:55:00`);
      periods.push(new Period(name, start, end));

      name = "Lunch 8B"
      start = new Date(`${year}-${month}-${day}T11:58:00`);
      end = new Date(`${year}-${month}-${day}T12:38:00`);
      periods.push(new Period(name, start, end));

      name = "Period 8B"
      start = new Date(`${year}-${month}-${day}T12:41:00`);
      end = new Date(`${year}-${month}-${day}T13:25:00`);
      periods.push(new Period(name, start, end));
    } else {
      name = "Period 8C"
      start = new Date(`${year}-${month}-${day}T11:10:00`);
      end = new Date(`${year}-${month}-${day}T12:40:00`);
      periods.push(new Period(name, start, end));

      name = "Lunch 8C"
      start = new Date(`${year}-${month}-${day}T12:45:00`);
      end = new Date(`${year}-${month}-${day}T13:25:00`);
      periods.push(new Period(name, start, end));
    }

    name = "Period 6"
    start = new Date(`${year}-${month}-${day}T13:30:00`);
    end = new Date(`${year}-${month}-${day}T15:00:00`);
    periods.push(new Period(name, start, end));
  }

  /*
  for(let i = 0; i < periods.length; i++) {
    Logger.log(periods[i].toString());
  }
  */

  return periods;
}
