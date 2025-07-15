// The phases of a Dota game and their approximate minute timings:
const DOTA_GAME_PHASES = [
  { phase: "Laning stage", start: 0, end: 10 },         // 0-10 min
  { phase: "Early game", start: 10, end: 20 },          // 10-20 min
  { phase: "Mid game", start: 20, end: 35 },            // 20-35 min
  { phase: "Late game", start: 35, end: 60 },           // 35-60 min
  { phase: "Ultra late game", start: 60, end: null }    // 60+ min
];

const STACKING_TIMING = 54;
const LEYWAY_TO_WALK = 20;
const START_ANCIENT_STACKING = 60*3 + 54;
const NUMBER_ANCIENT_STACKS = 7
export const ANCIENT_STACKING_TIMINGS = Array.from({ length: NUMBER_ANCIENT_STACKS + 1 }, (_, i) => (i * 60) - LEYWAY_TO_WALK + START_ANCIENT_STACKING);

export const GO_TO_XP_TIMINGS = [
    60*6 + 56,
    60*13 + 40,
    60*20 + 40,
]

export const GANKING_TIMINGS = [
    60*4 + 40, // Start of night
    60*7 + 40 // Power rune 
]

export const WARDING_TIMINGS = [
    60*5 + 40,
    60*11 + 40,
    60*17 + 40,
    60*23 + 40,
    60*29 + 40,
    60*35 + 40,
    60*41 + 40,
    60*47 + 40,
    60*53 + 40,
    60*59 + 40,
]

export const ROSHAN_TIMINGS = [ 
    60 * 30,
    60 * 40
]

export const LOTUS_TIMINGS = [
    60*2 + 30,
    60*5 + 30,
    60*8 + 30,
]

export const TIMINGS = {
    "Warding": {
        "timings": WARDING_TIMINGS,
        "icon": "bi bi-eye",
        "sound": "Wards.mp3"
    },
    "Roshan": {
        "timings": ROSHAN_TIMINGS,
        "icon": "bi bi-gitlab",
        "sound": "Roshan.mp3"
    },
    "Lotus": {
        "timings": LOTUS_TIMINGS,
        "icon": "bi bi-flower1",
        "sound": "Lotus.mp3"
    },
    "Ancient Stacking": {
        "timings": ANCIENT_STACKING_TIMINGS,
        "icon": "bi bi-stack",
        "sound": "Stack Ancients.mp3"
    },
    "Ganking": {
        "timings": GANKING_TIMINGS,
        "icon": "bi bi-arrow-left-right",
        "sound": "gank.mp3"
    },
    "XP Rune": {
        "timings": GO_TO_XP_TIMINGS,
        "icon": "bi bi-journal-bookmark",
        "sound": "XP.mp3"
    }
}

// console.log(
//   ANCIENT_STACKING_TIMINGS.map(seconds => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.abs(seconds % 60);
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   })
// );

// Example: get phase by minute
export function getDotaGamePhaseByMinute(minute) {
  for (const { phase, start, end } of DOTA_GAME_PHASES) {
    if (end === null && minute >= start) return phase;
    if (minute >= start && minute < end) return phase;
  }
  return null;
}

export default DOTA_GAME_PHASES;

