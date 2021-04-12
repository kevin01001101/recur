import { assertEquals, assertThrows } from "https://deno.land/std@0.90.0/testing/asserts.ts";
import { RecurrenceRule } from "./RecurrenceRule.ts";

const start = "1997-09-02T09:00:00-04:00";
const ONE_DAY = 24 * 3600 * 1000;



Deno.test("Every day in January, for 3 years (as Yearly)",
    () => {   
        const re = new RecurrenceRule("FREQ=YEARLY;UNTIL=2000-01-31T14:00:00Z;BYMONTH=1;BYDAY=SU,MO,TU,WE,TH,FR,SA", start);
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