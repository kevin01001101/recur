import { RecurrenceRule } from "./RecurrenceRule.ts";


const start = "1997-09-02T09:00:00-05:00";
const ONE_DAY = 24 * 3600 * 1000;

const re = new RecurrenceRule("FREQ=MINUTELY;INTERVAL=20;BYHOUR=9,10,11,12,13,14,15,16", start);
//const re = new RecurrenceRule("FREQ=DAILY;BYHOUR=9,10,11,12,13,14,15,16;BYMINUTE=0,20,40", start);

const dateGenerator = re.GenerateDate();

const previousDate:Date = dateGenerator.next().value;
console.log(previousDate);