/**
 * 🚂 Indian Railway PNR Status System
 *
 * IRCTC ka PNR status system bana! PNR data milega with train info,
 * passengers, aur current statuses. Tujhe ek complete status report
 * generate karna hai with formatted output aur analytics.
 *
 * pnrData object:
 *   {
 *     pnr: "1234567890",
 *     train: { number: "12301", name: "Rajdhani Express", from: "NDLS", to: "HWH" },
 *     classBooked: "3A",
 *     passengers: [
 *       { name: "Rahul Kumar", age: 28, gender: "M", booking: "B1", current: "B1" },
 *       { name: "Priya Sharma", age: 25, gender: "F", booking: "WL5", current: "B3" },
 *       { name: "Amit Singh", age: 60, gender: "M", booking: "WL12", current: "WL8" }
 *     ]
 *   }
 *
 * Status rules (based on current field):
 *   - Starts with "B" or "S" (berth/seat) => status = "CONFIRMED"
 *   - Starts with "WL" => status = "WAITING"
 *   - Equals "CAN" => status = "CANCELLED"
 *   - Starts with "RAC" => status = "RAC"
 *
 * For each passenger generate:
 *   - formattedName: name.padEnd(20) + "(" + age + "/" + gender + ")"
 *   - bookingStatus: booking field value
 *   - currentStatus: current field value
 *   - statusLabel: one of "CONFIRMED", "WAITING", "CANCELLED", "RAC"
 *   - isConfirmed: boolean (true only if statusLabel === "CONFIRMED")
 *
 * Summary (use array methods on processed passengers):
 *   - totalPassengers: count of passengers
 *   - confirmed: count of CONFIRMED
 *   - waiting: count of WAITING
 *   - cancelled: count of CANCELLED
 *   - rac: count of RAC
 *   - allConfirmed: boolean - every passenger confirmed? (use every)
 *   - anyWaiting: boolean - some passenger waiting? (use some)
 *
 * Other fields:
 *   - chartPrepared: true if every NON-CANCELLED passenger is confirmed
 *   - pnrFormatted: "123-456-7890" (3-3-4 dash pattern, use slice + join or concatenation)
 *   - trainInfo: template literal =>
 *     "Train: {number} - {name} | {from} → {to} | Class: {classBooked}"
 *
 * Hint: Use padEnd(), slice(), join(), map(), filter(), every(), some(),
 *   startsWith(), template literals, typeof, Array.isArray()
 *
 * Validation:
 *   - Agar pnrData object nahi hai ya null hai, return null
 *   - Agar pnr string nahi hai ya exactly 10 digits nahi hai, return null
 *   - Agar train object missing hai, return null
 *   - Agar passengers array nahi hai ya empty hai, return null
 *
 * @param {object} pnrData - PNR data object
 * @returns {{ pnrFormatted: string, trainInfo: string, passengers: Array<{ formattedName: string, bookingStatus: string, currentStatus: string, statusLabel: string, isConfirmed: boolean }>, summary: { totalPassengers: number, confirmed: number, waiting: number, cancelled: number, rac: number, allConfirmed: boolean, anyWaiting: boolean }, chartPrepared: boolean } | null}
 *
 * @example
 *   processRailwayPNR({
 *     pnr: "1234567890",
 *     train: { number: "12301", name: "Rajdhani Express", from: "NDLS", to: "HWH" },
 *     classBooked: "3A",
 *     passengers: [
 *       { name: "Rahul", age: 28, gender: "M", booking: "B1", current: "B1" }
 *     ]
 *   })
 *   // => { pnrFormatted: "123-456-7890",
 *   //      trainInfo: "Train: 12301 - Rajdhani Express | NDLS → HWH | Class: 3A",
 *   //      passengers: [...], summary: { ..., allConfirmed: true }, chartPrepared: true }
 */
export function processRailwayPNR(pnrData) {
  if (
    typeof pnrData !== "object" ||
    pnrData === null ||
    Array.isArray(pnrData) ||
    typeof pnrData.pnr !== "string" ||
    pnrData.pnr.length !== 10 ||
    Number.isNaN(Number(pnrData.pnr)) || 
    !pnrData.hasOwnProperty("train") ||
    !Boolean(pnrData.train) || 
    !pnrData.hasOwnProperty("passengers") ||
    !Array.isArray(pnrData.passengers) ||
    pnrData.passengers.length == 0
  )
    return null;

  const { pnr, train, classBooked, passengers } = pnrData;

  const pnrFormatted = `${pnr.slice(0, 3)}-${pnr.slice(3, 6)}-${pnr.slice(6)}`;

  const trainInfo = `Train: ${train.number} - ${train.name} | ${train.from} → ${train.to} | Class: ${classBooked}`;

  const passengersArray = passengers.map((passenger) => {
    return {
      formattedName: `${passenger.name.padEnd(20)}(${passenger.age}/${passenger.gender})`,
      bookingStatus: passenger.booking,
      currentStatus: passenger.current,
      statusLabel: status(passenger.current),
      isConfirmed: status(passenger.current) === "CONFIRMED",
    };
  });

  

  const summary = passengersArray.reduce(
    (acc, passenger) => {
      acc.totalPassengers++;
      if (passenger.statusLabel === "CONFIRMED") acc.confirmed++;
      else if (passenger.statusLabel === "WAITING") acc.waiting++;
      else if (passenger.statusLabel === "CANCELLED") acc.cancelled++;
      else if (passenger.statusLabel === "RAC") acc.rac++;
      return acc;
    },
    { totalPassengers: 0, confirmed: 0, waiting: 0, cancelled: 0, rac: 0, allConfirmed: true , anyWaiting: false},
  );

  summary.allConfirmed = passengersArray.every(
    (passenger) => passenger.statusLabel === "CONFIRMED",
  );
  summary.anyWaiting = passengersArray.some(
    (passenger) => passenger.statusLabel === "WAITING",
  );

  const chartPrepared =
    summary.waiting ===0 && summary.rac ===0 && summary.totalPassengers ===(summary.confirmed+summary.cancelled);

  return {
    pnrFormatted,
    trainInfo,
    passengers: passengersArray,
    summary,
    chartPrepared,
  };
}

function status(value) {
  if (value[0] === "B" || value[0] === "S") return "CONFIRMED";
  if (value.slice(0, 2) === "WL") return "WAITING";
  if (value === "CAN") return "CANCELLED";
  if (value.slice(0, 3) === "RAC") return "RAC";
}
