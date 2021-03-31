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
        const re = new RecurringEvent("FREQ=DAILY;BYDAY=+1MO", start);
        assertEquals(re.isValid, false);
    }
})

Deno.test({
    name: "The BYDAY rule part MAY be specified WITHOUT a numeric value when the FREQ rule part is not set to MONTHLY or YEARLY",
    fn: () => {
        const re = new RecurringEvent("FREQ=DAILY;BYDAY=MO", start);
        assertEquals(re.isValid, true);
    }
})

Deno.test({
    name: '"FREQ=DAILY;COUNT=10" shall produce 10 valid dates',
    fn: () => {
        const start = new Date();
        const re = new RecurringEvent("FREQ=DAILY;COUNT=10", start);
        const generator = re.GenerateDate();
        const startPlus9 = new Date(start);
        startPlus9.setDate(startPlus9.getDate()+9);

        const results = [];
        for (let i=0; i <= 10; i++) {
            results.push(generator.next());
        }        
                
        assertEquals(results.filter(r => r.done == false).length, 10);
        assertEquals(results[0].value.getDate(), start.getDate());
        assertEquals(results[9].value.getDate(), startPlus9.getDate());
    }
})

Deno.test({
    name: "Iterator Testing",
    fn: () => {
        //const re = new RecurringEvent("FREQ=DAILY;INTERVAL=1;BYDAY=SU;BYHOUR=8,9;BYMINUTE=30;BYSETPOS=-1", start);
        const re = new RecurringEvent("FREQ=DAILY;BYMONTH=5;COUNT=50", new Date(2021,5,28));
        
        //const re = new RecurringEvent("FREQ=YEARLY;INTERVAL=1;BYMONTH=1,2,3;BYWEEKNO=52;BYYEARDAY=150,151,152;COUNT=50", start);
        console.log(re.start);

        const generator = re.GenerateDate();
        console.log(generator.next());
        console.log(generator.next());
        console.log(generator.next());
        console.log(generator.next());
        console.log(generator.next());
        console.log(generator.next());
        console.log(generator.next());
        console.log(generator.next());
        console.log(generator.next());
        console.log(generator.next());
        console.log(generator.next());
        console.log(generator.next());
        
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