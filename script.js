const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

let lunch = 0;

// DOM cache
const el = {
  day: document.getElementById("day"),
  date: document.getElementById("date"),
  time: document.getElementById("time"),
  current: document.getElementById("current"),
  end: document.getElementById("end"),
  next: document.getElementById("next"),
  start: document.getElementById("start"),
  remaining: document.getElementById("remaining"),
  lunch: document.getElementById("lunch")
};

el.lunch.onclick = () => {
  lunch = (lunch + 1) % 3;
};

setInterval(updateTime, 1000);

// ---------- Period class ----------

class Period {
  constructor(name, start, end) {
    this.name = name;
    this.start = start;
    this.end = end;
  }

  static formatTime(date) {
    const h = (date.getHours() % 12 || 12).toString().padStart(2,'0');
    const m = date.getMinutes().toString().padStart(2,'0');
    return `${h}:${m}`;
  }

  get startTime() {
    return Period.formatTime(this.start);
  }

  get endTime() {
    return Period.formatTime(this.end);
  }
}

// ---------- Helpers ----------

function formatTime(date, withSeconds=false) {
  const h = (date.getHours() % 12 || 12).toString().padStart(2,'0');
  const m = date.getMinutes().toString().padStart(2,'0');
  const s = date.getSeconds().toString().padStart(2,'0');
  return withSeconds ? `${h}:${m}:${s}` : `${h}:${m}`;
}

function msToTime(ms) {
  const s = Math.floor((ms/1000)%60);
  const m = Math.floor((ms/60000)%60);
  const h = Math.floor(ms/3600000);
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

function getOrdinal(n) {
  if (n >= 11 && n <= 13) return "th";
  switch (n % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

// ---------- Schedule Data ----------

const SCHEDULES = {
  WEEKDAY_MF: [
    ["Period 1","08:00","08:43"],
    ["Period 2","08:48","09:31"],
    ["Glenbard Hour","09:34","10:14"],
    ["Period 3","10:17","11:00"],
    ["Period 4","11:05","11:48"],
    ["Period 5","11:53","12:36"],
    ["Period 6","12:41","13:24"],
    ["Period 7","13:29","14:12"],
    ["Period 8","14:17","15:00"]
  ],

  TUESDAY: [
    ["Period 1","08:00","08:43"],
    ["Period 2","08:48","09:31"],
    ["Period 3","09:36","10:19"],
    ["Period 4","10:24","11:07"],
    ["Period 5","11:12","11:55"],
    ["Period 6","12:00","12:43"],
    ["Period 7","12:48","13:31"],
    ["Period 8","13:36","14:19"],
    ["PLC","14:23","15:05"]
  ],

  WEDNESDAY: {
    A: [
      ["Period 1","08:00","09:30"],
      ["Period 3","09:35","11:05"],
      ["Lunch","11:10","11:50"],
      ["Period 7A","11:55","13:25"],
      ["Period 5","13:30","15:00"]
    ],

    B: [
      ["Period 1","08:00","09:30"],
      ["Period 3","09:35","11:05"],
      ["Period 7B","11:10","11:55"],
      ["Lunch","11:58","12:38"],  // ⚠️ fixed overlap
      ["Period 7B","12:41","13:25"],
      ["Period 5","13:30","15:00"]
    ],

    C: [
      ["Period 1","08:00","09:30"],
      ["Period 3","09:35","11:05"],
      ["Period 7C","11:10","12:40"],
      ["Lunch","12:45","13:25"],
      ["Period 5","13:30","15:00"]
    ]
  },
  
THURSDAY: {
  A: [
    ["Period 2","08:00","09:30"],
    ["Period 4","09:35","11:05"],
    ["Lunch","11:10","11:50"],
    ["Period 8A","11:55","13:25"],
    ["Period 6","13:30","15:00"]
  ],

  B: [
    ["Period 2","08:00","09:30"],
    ["Period 4","09:35","11:05"],
    ["Period 8B","11:10","11:55"],
    ["Lunch","11:58","12:38"],
    ["Period 8B","12:41","13:25"],
    ["Period 6","13:30","15:00"]
  ],

  C: [
    ["Period 2","08:00","09:30"],
    ["Period 4","09:35","11:05"],
    ["Period 8C","11:10","12:40"],
    ["Lunch","12:45","13:25"],
    ["Period 6","13:30","15:00"]
  ]
},
  
WEEKEND: []
};

const SPECIAL_DAYS = {
  "2026-04-24": [
    ["Period 1","08:00","08:40"],
    ["Period 2","08:45","09:25"],
    ["Period 3","09:30","10:10"],
    ["Period 4","10:15","10:55"],
    ["Period 5","11:00","11:40"],
    ["Period 6","11:45","12:25"],
    ["Period 7","12:30","13:10"],
    ["Period 8","13:15","13:55"],
    ["Pep Assembly","14:00","15:00"]
  ]
};

// ---------- Build Periods ----------

function buildPeriods(schedule, date) {
  const y = date.getFullYear();
  const m = (date.getMonth()+1).toString().padStart(2,'0');
  const d = date.getDate().toString().padStart(2,'0');

  return schedule.map(([name,start,end]) =>
    new Period(
      name,
      new Date(`${y}-${m}-${d}T${start}:00`),
      new Date(`${y}-${m}-${d}T${end}:00`)
    )
  );
}

function getPeriods() {
  const date = new Date();
  const day = date.getDay();
  const lunchKey = ["A","B","C"][lunch];
  const key = date.toISOString().split("T")[0];

  if (SPECIAL_DAYS[key]) return buildPeriods(SPECIAL_DAYS[key], date);

  let schedule;

  if (day === 0 || day === 6) schedule = SCHEDULES.WEEKEND;
  else if (day === 1 || day === 5) schedule = SCHEDULES.WEEKDAY_MF;
  else if (day === 2) schedule = SCHEDULES.TUESDAY;
  else if (day === 3) schedule = SCHEDULES.WEDNESDAY[lunchKey];
  else if (day === 4) schedule = SCHEDULES.THURSDAY[lunchKey];

  return buildPeriods(schedule, date);
}

// ---------- Current Logic ----------

function getCurrent() {
  const now = new Date();
  const periods = getPeriods();
  const dayIndex = now.getDay();

  const result = {
    day: days[dayIndex],
    month: months[now.getMonth()],
    date: now.getDate(),
    year: now.getFullYear(),
    time: formatTime(now, true),
    current: "",
    end: "",
    next: "",
    start: "",
    remaining: ""
  };

  if (dayIndex === 0 || dayIndex === 6) return result;

  if (periods.length && now < periods[0].start) {
    result.current = "Before School";
    result.end = periods[0].startTime;
    result.next = periods[0].name;
    result.start = periods[0].startTime;
    result.remaining = msToTime(periods[0].start - now);
    return result;
  }

  if (periods.length && now > periods.at(-1).end) {
    result.current = "After School";
    return result;
  }

  for (let i = 0; i < periods.length; i++) {
    const p = periods[i];
    const next = periods[i+1];

    if (now >= p.start && now <= p.end) {
      result.current = p.name;
      result.end = p.endTime;
      if (next) {
        result.next = next.name;
        result.start = next.startTime;
      }
      result.remaining = msToTime(p.end - now);
      return result;
    }

    if (next && now > p.end && now < next.start) {
      result.current = "Passing Period";
      result.end = next.startTime;
      result.next = next.name;
      result.start = next.startTime;
      result.remaining = msToTime(next.start - now);
      return result;
    }
  }

  return result;
}

// ---------- UI ----------

function updateTime() {
  const data = getCurrent();

  el.day.textContent = data.day;
  el.date.textContent = `${data.month} ${data.date}${getOrdinal(data.date)}, ${data.year}`;
  el.time.textContent = data.time;

  el.current.textContent = data.current;
  el.end.textContent = data.end;
  el.next.textContent = data.next;
  el.start.textContent = data.start;
  el.remaining.textContent = data.remaining;

  const labels = ["A","B","C"];
  el.lunch.innerHTML = `LUNCH: ${labels.map((l,i)=>
    i===lunch ? `<b><u>${l}</u></b>` : l
  ).join(" ")}`;
}
