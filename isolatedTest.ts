import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";
import { RecurrenceRule } from "./RecurrenceRule.ts";

const start = "1997-09-02T09:00:00-04:00";


Deno.test("Every day in January, for 3 years (as Yearly)",
    () => {   
        const re = new RecurrenceRule("FREQ=YEARLY;UNTIL=2000-01-31T14:00:00Z;BYMONTH=1;BYDAY=SU,MO,TU,WE,TH,FR,SA", start);
        const dateGenerator = re.GenerateDate();
        
        let previousDate = dateGenerator.next().value;
        console.log("R>" + previousDate);
        let count = 1;
        for (const eventDate of dateGenerator) {
            console.log("R>" + eventDate);
            assertEquals(eventDate.getMonth(), 0, "Date is not in January");
            if (eventDate.getDate() > 1) {
                const diffDate = new Date(eventDate);
                diffDate.setDate(diffDate.getDate()-1);
                assertEquals(previousDate.getDate(), diffDate.getDate(), "Dates do not differ by 1 day");
            }
            previousDate = eventDate;
            count++;
        }
        assertEquals(count, 93);  
    }
);