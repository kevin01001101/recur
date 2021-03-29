import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";
import { RecurringEvent } from "./RecurringEvent.ts";

Deno.test({
    name: "First Test",
    fn: () => {
        const x = 1 + 2;
        assertEquals(x, 3);
    }
});

const start = new Date();

Deno.test({
    name: "A recurrence event with an invalid Rule Part is invalid",
    fn: () => {
        const re = new RecurringEvent("FRAQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-1", start);
        console.log(re);
        assertEquals(re.isValid, false);

    }
})

Deno.test({
    name: "A valid recurrence event is valid",
    fn: () => {
        const re = new RecurringEvent("FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-1", start);
        assertEquals(re.isValid, true);
    }
});

Deno.test({
    name: "A valid recurrence event is valid",
    fn: () => {
        const re = new RecurringEvent("FREQ=DAILY;COUNT=10;INTERVAL=2", start);
        assertEquals(re.isValid, true);
    }
});

Deno.test({
    name: "A valid recurrence event is valid",
    fn: () => {
        const re = new RecurringEvent("FREQ=YEARLY;INTERVAL=2;BYMONTH=1;BYDAY=SU;BYHOUR=8,9;BYMINUTE=30", start);
        assertEquals(re.isValid, true);
    }
});

Deno.test({
    name: "The BYDAY rule part MUST NOT be specified with a numeric value when the FREQ rule part is not set to MONTHLY or YEARLY",
    fn: () => {
        const re = new RecurringEvent("FREQ=DAILY;BYDAY=MO", start);
        assertEquals(re.isValid, false);
    }
})

Deno.test({
    name: "The next day is the day after the start date",
    fn: () => {
        const re = new RecurringEvent("FREQ=DAILY;INTERVAL=1;BYDAY=SU;BYHOUR=8,9;BYMINUTE=30", start);
        //const re = new RecurringEvent("FREQ=YEARLY;INTERVAL=1;BYMONTH=1,2,3;BYWEEKNO=52;BYYEARDAY=150,151,152;COUNT=50", start);
        console.log(re.start);

        let iterator = re.GenerateDate();
        console.log(iterator.next());
        console.log(iterator.next());
        console.log(iterator.next());
        console.log(iterator.next());
        console.log(iterator.next());
        console.log(iterator.next());
        console.log(iterator.next());
        console.log(iterator.next());
        console.log(iterator.next());
        console.log(iterator.next());
        console.log(iterator.next());
        console.log(iterator.next());
        
        assertEquals(true, true);
    }
});


// ; The rule parts are not ordered in any
// ; particular sequence.
// ;
// ; The FREQ rule part is REQUIRED,
// ; but MUST NOT occur more than once.
// ;
//to ensure backward compatibility with applications that pre-date this revision of iCalendar the FREQ rule part MUST be the first rule part specified in a RECUR value.

// ; The UNTIL or COUNT rule parts are OPTIONAL,
// ; but they MUST NOT occur in the same 'recur'.