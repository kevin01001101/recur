import { RecurrenceRule } from "./RecurrenceRule.ts";


const start = "1997-09-02T09:00:00-04:00";
const ONE_DAY = 24 * 3600 * 1000;

const re = new RecurrenceRule("FREQ=YEARLY;BYWEEKNO=20;BYDAY=MO", "1997-05-12T09:00:00-04:00");
const dateGenerator = re.GenerateDate();

const previousDate:Date = dateGenerator.next().value;
console.log(previousDate);