import { assertEquals, assertThrows } from "https://deno.land/std@0.90.0/testing/asserts.ts";
import { RecurrenceRule } from "./RecurrenceRule.ts";


const start = "1997-09-02T09:00:00-04:00";
const DAY = 24 * 3600 * 1000;

Deno.test("Daily for 10 occurrences",
    () => {    
        const re = new RecurrenceRule("FREQ=DAILY;COUNT=10", start);
        const dateGenerator = re.GenerateDate();

        let count = 1;
        let previousDate = dateGenerator.next().value;
        for (const eventDate of dateGenerator) {
            // 1 day between events
            assertEquals((eventDate.valueOf() - previousDate.valueOf()), DAY, "Dates do not differ by 1");
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
            assertEquals((eventDate.valueOf() - previousDate.valueOf()), DAY, "Dates do not differ by 1");
            previousDate = eventDate;
        }
        assertEquals(previousDate.getUTCFullYear(), 1997);
        assertEquals(previousDate.getUTCMonth(), 11);
        assertEquals(previousDate.getUTCDate(), 23);
    }
);