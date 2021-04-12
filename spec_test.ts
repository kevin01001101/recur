import { assertEquals, assertThrows } from "https://deno.land/std@0.90.0/testing/asserts.ts";
import { RecurrenceRule } from "./RecurrenceRule.ts";


const start = "1997-09-02T09:00:00-04:00";
const ONE_DAY = 24 * 3600 * 1000;

Deno.test("Daily for 10 occurrences",
    () => {    
        const re = new RecurrenceRule("FREQ=DAILY;COUNT=10", start);
        const dateGenerator = re.GenerateDate();

        let count = 1;
        let previousDate = dateGenerator.next().value;
        for (const eventDate of dateGenerator) {
            // 1 day between events
            assertEquals((eventDate.valueOf() - previousDate.valueOf()), ONE_DAY, "Dates do not differ by 1");
            previousDate = eventDate;
            count++;
        }
        assertEquals(count, 10);
    }
);

Deno.test("Daily until December 24, 1997",
    () => {    
        const re = new RecurrenceRule("FREQ=DAILY;UNTIL=1997-12-24", start);
        const dateGenerator = re.GenerateDate();

        let previousDate = dateGenerator.next().value;
        for (const eventDate of dateGenerator) {
            // 1 day between events
            console.log("PD:", previousDate);
            assertEquals((eventDate.valueOf() - previousDate.valueOf()), ONE_DAY, "Dates do not differ by 1");
            previousDate = eventDate;
        }
        assertEquals(previousDate.getUTCFullYear(), 1997);
        assertEquals(previousDate.getUTCMonth(), 11);
        assertEquals(previousDate.getUTCDate(), 23);
    }
);

Deno.test("Every other day - forever",
    () => {    
        const re = new RecurrenceRule("FREQ=DAILY;COUNT=10", start);
        const dateGenerator = re.GenerateDate();

        let previousDate = dateGenerator.next().value;
        let count = 1;
        for (const eventDate of dateGenerator) {
            // 1 day between events
            assertEquals((eventDate.valueOf() - previousDate.valueOf()), ONE_DAY, "Dates do not differ by 1");
            previousDate = eventDate;
            count++;
        }
        assertEquals(count, 10);
    }
);

Deno.test("Every 10 days, 5 occurrences",
    () => {  
        const re = new RecurrenceRule("FREQ=DAILY;INTERVAL=10;COUNT=5", start);
        const dateGenerator = re.GenerateDate();
        
        let previousDate = dateGenerator.next().value;
        let count = 1;
        for (const eventDate of dateGenerator) {
            // 10 days between events
            assertEquals((eventDate.valueOf() - previousDate.valueOf()), ONE_DAY * 10, "Dates do not differ by 10");
            previousDate = eventDate;
            count++;
        }
        assertEquals(count, 5);  
    }
);

Deno.test("Every day in January, for 3 years (as Yearly)",
    () => {   
        const re = new RecurrenceRule("FREQ=YEARLY;UNTIL=2000-01-31;BYMONTH=1;BYDAY=SU,MO,TU,WE,TH,FR,SA", start);
        const dateGenerator = re.GenerateDate();
        
        let previousDate = dateGenerator.next().value;
        let count = 1;
        for (const eventDate of dateGenerator) {
            //console.log("R>" + eventDate);
            assertEquals(eventDate.getMonth(), 0, "Date is not in January");
            if (eventDate.getDate() > 1) {
                assertEquals((eventDate.valueOf() - previousDate.valueOf()), ONE_DAY, "Dates do not differ by 1 day");
            }
            previousDate = eventDate;
            count++;
        }
        assertEquals(count, 93);  
    }
);

Deno.test("Every day in January, for 3 years (as Daily)",
    () => {   
        const re = new RecurrenceRule("FREQ=DAILY;UNTIL=2000-01-31;BYMONTH=1", start);
        const dateGenerator = re.GenerateDate();
        
        let previousDate = dateGenerator.next().value;
        let count = 1;
        for (const eventDate of dateGenerator) {
            assertEquals(eventDate.getMonth(), 0, "Date is not in January");
            if (eventDate.getDate() > 1) {
                assertEquals((eventDate.valueOf() - previousDate.valueOf()), ONE_DAY, "Dates do not differ by 1 day");
            }
            previousDate = eventDate;
            count++;
        }
        assertEquals(count, 93);  
    }
);


Deno.test("Weekly for 10 occrrences",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Weekly until December 24, 1997",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Every other week - forever",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Weekly on Tuesday and Thursday for five weeks",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Every other week on MWF until Dec 24, 1997, starting on Monday, Sept 1, 1997",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Every other week on Tu and Th, for 8 occurrences",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Monthly on the first Friday for 10 occurrences",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Monthly on the first Friday until December 24, 1997",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Every other month on the first and last Sunday of the month for 10 occurrences",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Monthly on the second-to-last Monday of the month for 6 months",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Monthly on the third-to-the-last day of the month, forever",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Monthly on the 2nd and 15th of the month for 10 occurrences",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Monthly on the first and last day of the month for 10 occurrences",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Every 18 months on the 10th thru 15th of the month for 10 occurrences",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Every Tuesday, every other month, forever",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Yearly in June and July for 10 occurrences",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Every other year on January, February, and March for 10 occurrences",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Every third year on the 1st, 100th, and 200th day for 10 occurrences",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Every 20th Monday of the year, forever",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Monday of week number 20 (where the default start of the week is Monday), forever",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Every Thursday in March, forever",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Every Thursday, but only during June, July, and August, forever",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Every Friday the 13th, forever",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("The first Saturday that follows the first Sunday of the month, forever",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Every 4 years, the first Tuesday after a Monday in November, forever",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("The third instance into the month of one of Tuesday, Wednesday, or Thursday, for the next 3 months",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("The second-to-last weekday of the month",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Every 3 hours from 9:00 AM to 5:00 PM on a specific day",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Every 15 minutes for 6 occurrences",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Every hour and a half for 4 occurrences",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Every 20 minutes from 9:00 AM to 4:40 PM every day",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Sunday and Tuesday every other week, week starts on Monday, 4 occurrences",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Sunday and Tuesday every other week, week starts on Sunday, 4 occurrences",
    () => {    
        assertEquals(true, false);
    }
);

Deno.test("Invalid date (i.e., February 30) is ignored",
    () => {    
        assertEquals(true, false);
    }
);

