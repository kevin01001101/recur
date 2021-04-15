import { assertEquals, assertThrows, assertArrayIncludes } from "https://deno.land/std@0.90.0/testing/asserts.ts";
import { RecurrenceRule } from "./RecurrenceRule.ts";


const start = "1997-09-02T09:00:00-05:00";
const ONE_DAY = 24 * 3600 * 1000;

// Deno.test("Daily for 10 occurrences",
//     () => {    
//         const re = new RecurrenceRule("FREQ=DAILY;COUNT=10", start);
//         const dateGenerator = re.GenerateDate();

//         let count = 1;
//         let previousDate = dateGenerator.next().value;
//         for (const eventDate of dateGenerator) {
//             // 1 day between events
//             assertEquals((eventDate.valueOf() - previousDate.valueOf()), ONE_DAY, "Dates do not differ by 1");
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(count, 10);
//     }
// );

// Deno.test("Daily until December 24, 1997",
//     () => {    
//         const re = new RecurrenceRule("FREQ=DAILY;UNTIL=1997-12-24", start);
//         const dateGenerator = re.GenerateDate();

//         let previousDate = dateGenerator.next().value;
//         for (const eventDate of dateGenerator) {
//             // 1 day between events
//             assertEquals((eventDate.valueOf() - previousDate.valueOf()), ONE_DAY, "Dates do not differ by 1");
//             previousDate = eventDate;
//         }
//         assertEquals(previousDate.getUTCFullYear(), 1997);
//         assertEquals(previousDate.getUTCMonth(), 11);
//         assertEquals(previousDate.getUTCDate(), 23);
//     }
// );

// Deno.test("Every other day - forever",
//     () => {    
//         const re = new RecurrenceRule("FREQ=DAILY;COUNT=10", start);
//         const dateGenerator = re.GenerateDate();

//         let previousDate = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             // 1 day between events
//             assertEquals((eventDate.valueOf() - previousDate.valueOf()), ONE_DAY, "Dates do not differ by 1");
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(count, 10);
//     }
// );

// Deno.test("Every 10 days, 5 occurrences",
//     () => {  
//         const re = new RecurrenceRule("FREQ=DAILY;INTERVAL=10;COUNT=5", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             // 10 days between events
//             assertEquals((eventDate.valueOf() - previousDate.valueOf()), ONE_DAY * 10, "Dates do not differ by 10");
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(count, 5);  
//     }
// );

// Deno.test("Every day in January, for 3 years (as Yearly)",
//     () => {   
//         const re = new RecurrenceRule("FREQ=YEARLY;UNTIL=2000-01-31T14:00:00Z;BYMONTH=1;BYDAY=SU,MO,TU,WE,TH,FR,SA", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             //console.log("R>" + eventDate);
//             assertEquals(eventDate.getMonth(), 0, "Date is not in January");
//             if (eventDate.getDate() > 1) {
//                 assertEquals((eventDate.valueOf() - previousDate.valueOf()), ONE_DAY, "Dates do not differ by 1 day");
//             }
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(count, 93);  
//     }
// );

// Deno.test("Every day in January, for 3 years (as Daily)",
//     () => {   
//         const re = new RecurrenceRule("FREQ=DAILY;UNTIL=2000-01-31T14:00:00Z;BYMONTH=1", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertEquals(eventDate.getMonth(), 0, "Date is not in January");
//             if (eventDate.getDate() > 1) {
//                 assertEquals((eventDate.valueOf() - previousDate.valueOf()), ONE_DAY, "Dates do not differ by 1 day");
//             }
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(count, 93);  
//     }
// );

// Deno.test("Weekly for 10 occrrences",
//     () => {   
//         const re = new RecurrenceRule("FREQ=WEEKLY;COUNT=10", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertEquals((eventDate.valueOf() - previousDate.valueOf()), ONE_DAY * 7, "Dates do not differ by 7 days");
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(count, 10);  
//     }
// );

Deno.test("Weekly until December 24, 1997",
    () => {   
        const re = new RecurrenceRule("FREQ=WEEKLY;UNTIL=1997-12-24Z", "1997-09-02T09:00:00");
        const dateGenerator = re.GenerateDate();
        
        let previousDate:Date = dateGenerator.next().value;
        let count = 1;
        for (const eventDate of dateGenerator) {
            const diffDate = new Date(eventDate);
            diffDate.setDate(diffDate.getDate()-7);
            assertEquals(previousDate.getDate(), diffDate.getDate(), "Dates do not differ by 7 days");
            previousDate = eventDate;
            count++;
        }
        console.log("previousDate: ", previousDate);
        assertEquals(previousDate.toString(), (new Date("1997-12-23T09:00:00")).toString(), "Last events don't match.");
        assertEquals(count, 17, "Expected event counts don't match.");  
    }
);

// Deno.test("Every other week - forever",
//     () => {   
//         const re = new RecurrenceRule("FREQ=WEEKLY;INTERVAL=2;WKST=SU", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertEquals((eventDate.valueOf() - previousDate.valueOf()), ONE_DAY * 14, "Dates do not differ by 2 weeks");

//             previousDate = eventDate;
//             count++;
//             if (count == 13) break;
//         }
//         console.log("previousDate: ", previousDate);
//         assertEquals(previousDate.toString(), (new Date("1998-02-17T09:00:00-04:00")).toString(), "Last events don't match.");
//     }
// );

// Deno.test("Weekly on Tuesday and Thursday for five weeks",
//     () => {   
//         const re = new RecurrenceRule("FREQ=WEEKLY;UNTIL=1997-10-07Z;WKST=SU;BYDAY=TU,TH", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertArrayIncludes([2,4], [eventDate.getDay()], "Date is not Tuesday or Thursday");
//             previousDate = eventDate;
//             count++;
//         }
//         console.log("previousDate: ", previousDate);
//         assertEquals(previousDate.valueOf(), (new Date("1997-10-02T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 10, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Weekly on Tuesday and Thursday for five weeks (Alternate)",
//     () => {   
//         const re = new RecurrenceRule("FREQ=WEEKLY;COUNT=10;WKST=SU;BYDAY=TU,TH", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertArrayIncludes([2,4], [eventDate.getDay()], "Date is not Tuesday or Thursday");
//             previousDate = eventDate;
//             count++;
//         }
//         console.log("previousDate: ", previousDate);
//         assertEquals(previousDate.valueOf(), (new Date("1997-10-02T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 10, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Every other week on MWF until Dec 24, 1997, starting on Monday, Sept 1, 1997",
//     () => {   
//         const re = new RecurrenceRule("FREQ=WEEKLY;INTERVAL=2;UNTIL=1997-12-24Z;WKST=SU;BYDAY=MO,WE,FR", "1997-09-01T09:00:00-04:00");
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertArrayIncludes([1,3,5], [eventDate.getDay()], "Date is not MWF");
//             console.log("RESULT: ", eventDate.toLocaleString());
//             previousDate = eventDate;
//             count++;
//         }
//         // console.log("previousDate: ", previousDate);
//         // assertEquals(previousDate.valueOf(), (new Date("1997-10-02T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 25, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Every other week on Tu and Th, for 8 occurrences",
//     () => {   
//         const re = new RecurrenceRule("FREQ=WEEKLY;INTERVAL=2;COUNT=8;WKST=SU;BYDAY=TU,TH", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertArrayIncludes([2,4], [eventDate.getDay()], "Date is not TuTh");
//             console.log("RESULT: ", eventDate.toLocaleString());
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1997-10-16T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 8, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Monthly on the first Friday for 10 occurrences",
//     () => {   
//         const re = new RecurrenceRule("FREQ=MONTHLY;COUNT=10;BYDAY=1FR", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertArrayIncludes([5], [eventDate.getDay()], "Date is not Friday");
//             console.log("RESULT: ", eventDate.toLocaleString());
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1998-06-05T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 10, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Monthly on the first Friday until December 24, 1997",
//     () => {   
//         const re = new RecurrenceRule("FREQ=MONTHLY;UNTIL=1997-12-24Z;BYDAY=1FR", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertArrayIncludes([5], [eventDate.getDay()], "Date is not Friday");
//             console.log("RESULT: ", eventDate.toLocaleString());
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1997-12-05T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 4, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Every other month on the first and last Sunday of the month for 10 occurrences",
//     () => {   
//         const re = new RecurrenceRule("FREQ=MONTHLY;INTERVAL=2;COUNT=10;BYDAY=1SU,-1SU", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertArrayIncludes([0], [eventDate.getDay()], "Date is not Sunday");
//             console.log("RESULT: ", eventDate.toLocaleString());
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1998-05-31T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 10, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Monthly on the second-to-last Monday of the month for 6 months",
//     () => {   
//         const re = new RecurrenceRule("FREQ=MONTHLY;COUNT=6;BYDAY=-2MO", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertArrayIncludes([1], [eventDate.getDay()], "Date is not Monday");
//             console.log("RESULT: ", eventDate.toLocaleString());
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1998-02-16T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 6, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Monthly on the third-to-the-last day of the month, forever",
//     () => {   
//         const re = new RecurrenceRule("FREQ=MONTHLY;BYMONTHDAY=-3", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             previousDate = eventDate;
//             count++;
//             if (count == 6) break;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1998-02-26T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 6, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Monthly on the 2nd and 15th of the month for 10 occurrences",
//     () => {   
//         const re = new RecurrenceRule("FREQ=MONTHLY;COUNT=10;BYMONTHDAY=2,15", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertArrayIncludes([2,15], [eventDate.getUTCDate()], "Date is not 2nd or 15th");
//             console.log("RESULT: ", eventDate.toLocaleString());
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1998-01-15T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 10, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Monthly on the first and last day of the month for 10 occurrences",
//     () => {   
//         const re = new RecurrenceRule("FREQ=MONTHLY;COUNT=10;BYMONTHDAY=1,-1", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             // if (eventDate.getUTCDate() == 1)
//             // assertArrayIncludes([2,15], [eventDate.getUTCDate()], "Date is 2nd or 15th");
//             // console.log("RESULT: ", eventDate.toLocaleString());
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1998-02-01T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 10, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Every 18 months on the 10th thru 15th of the month for 10 occurrences",
//     () => {   
//         const re = new RecurrenceRule("FREQ=MONTHLY;INTERVAL=18;COUNT=10;BYMONTHDAY=10,11,12,13,14,15", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             // if (eventDate.getUTCDate() == 1)
//             // assertArrayIncludes([2,15], [eventDate.getUTCDate()], "Date is 2nd or 15th");
//             // console.log("RESULT: ", eventDate.toLocaleString());
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1999-03-13T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 10, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Every Tuesday, every other month, forever",
//     () => {   
//         const re = new RecurrenceRule("FREQ=MONTHLY;INTERVAL=2;BYDAY=TU", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertArrayIncludes([2], [eventDate.getUTCDay()], "Date is not Tuesday");
//             previousDate = eventDate;
//             count++;
//             if (count == 18) break;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1998-03-31T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 18, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Yearly in June and July for 10 occurrences",
//     () => {   
//         const re = new RecurrenceRule("FREQ=YEARLY;COUNT=10;BYMONTH=6,7", "1997-06-10T09:00:00-04:00");
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertArrayIncludes([10], [eventDate.getUTCDate()], "Date is not the 10th");
//             // and Month is 6 or 7
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("2001-07-10T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 10, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Every other year on January, February, and March for 10 occurrences",
// () => {   
//     const re = new RecurrenceRule("FREQ=YEARLY;INTERVAL=2;COUNT=10;BYMONTH=1,2,3", "1997-03-10T09:00:00-04:00");
//     const dateGenerator = re.GenerateDate();
    
//     let previousDate:Date = dateGenerator.next().value;
//     let count = 1;
//     for (const eventDate of dateGenerator) {
//         assertArrayIncludes([10], [eventDate.getUTCDate()], "Date is not the 10th");
//         // and Month is 6 or 7
//         previousDate = eventDate;
//         count++;
//     }
//     assertEquals(previousDate.valueOf(), (new Date("2003-03-10T09:00:00-04:00")).valueOf(), "Last events don't match.");
//     assertEquals(count, 10, "Expected event counts don't match.");  
// }
// );

// Deno.test("Every third year on the 1st, 100th, and 200th day for 10 occurrences",
// () => {   
//     const re = new RecurrenceRule("FREQ=YEARLY;INTERVAL=3;COUNT=10;BYYEARDAY=1,100,200", "1997-01-01T09:00:00-04:00");
//     const dateGenerator = re.GenerateDate();
    
//     let previousDate:Date = dateGenerator.next().value;
//     let count = 1;
//     for (const eventDate of dateGenerator) {
//         // date is 1st, 100th or 200th day of the year
//         previousDate = eventDate;
//         count++;
//     }
//     assertEquals(previousDate.valueOf(), (new Date("2006-01-01T09:00:00-04:00")).valueOf(), "Last events don't match.");
//     assertEquals(count, 10, "Expected event counts don't match.");  
// }
// );

// Deno.test("Every 20th Monday of the year, forever",
//     () => {   
//         const re = new RecurrenceRule("FREQ=YEARLY;BYDAY=20MO", "1997-05-19T09:00:00-04:00");
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             // Date is the 20th Monday of the Year
//             previousDate = eventDate;
//             count++;
//             if (count == 3) break;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1999-05-17T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 3, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Monday of week number 20 (where the default start of the week is Monday), forever",
//     () => {   
//         const re = new RecurrenceRule("FREQ=YEARLY;BYWEEKNO=20;BYDAY=MO", "1997-05-12T09:00:00-04:00");
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             // Date is the 20th Monday of the Year
//             previousDate = eventDate;
//             count++;
//             if (count == 3) break;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1999-05-17T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 3, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Every Thursday in March, forever",
//     () => {   
//         const re = new RecurrenceRule("FREQ=YEARLY;BYMONTH=3;BYDAY=TH", "1997-03-13T09:00:00-04:00");
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertArrayIncludes([4], [eventDate.getUTCDay()], "Day is not Thursday");
//             previousDate = eventDate;
//             count++;
//             if (count == 11) break;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1999-03-25T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 11, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Every Thursday, but only during June, July, and August, forever",
//     () => {   
//         const re = new RecurrenceRule("FREQ=YEARLY;BYDAY=TH;BYMONTH=6,7,8", "1997-06-05T09:00:00-04:00");
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertArrayIncludes([4], [eventDate.getUTCDay()], "Day is not Thursday");
//             previousDate = eventDate;
//             count++;
//             if (count == 39) break;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1999-08-26T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 39, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Every Friday the 13th, forever",
//     () => {   
//         const re = new RecurrenceRule("FREQ=MONTHLY;BYDAY=FR;BYMONTHDAY=13", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertEquals(5, eventDate.getUTCDay(), "Day is not Friday");
//             assertEquals(13, eventDate.getUTCDate(), "Date is not 13th");
//             previousDate = eventDate;
//             count++;
//             if (count == 5) break;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("2000-10-13T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 5, "Expected event counts don't match.");  
//     }
// );

// Deno.test("The first Saturday that follows the first Sunday of the month, forever",
//     () => {   
//         const re = new RecurrenceRule("FREQ=MONTHLY;BYDAY=SA;BYMONTHDAY=7,8,9,10,11,12,13", "1997-09-13T09:00:00-04:00");
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertArrayIncludes([6], [eventDate.getUTCDay()], "Day is not Saturday");
//             previousDate = eventDate;
//             count++;
//             if (count == 10) break;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1998-06-13T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 10, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Every 4 years, the first Tuesday after a Monday in November, forever",
//     () => {   
//         const re = new RecurrenceRule("FREQ=YEARLY;INTERVAL=4;BYMONTH=11;BYDAY=TU;BYMONTHDAY=2,3,4,5,6,7,8", "1996-11-05T09:00:00-04:00");
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertArrayIncludes([2], [eventDate.getUTCDay()], "Day is not Tuesday");
//             previousDate = eventDate;
//             count++;
//             if (count == 3) break;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("2004-11-02T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 3, "Expected event counts don't match.");  
//     }
// );

// Deno.test("The third instance into the month of one of Tuesday, Wednesday, or Thursday, for the next 3 months",
//     () => {   
//         const re = new RecurrenceRule("FREQ=MONTHLY;COUNT=3;BYDAY=TU,WE,TH;BYSETPOS=3", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertArrayIncludes([2,3,4], [eventDate.getUTCDay()], "Day is not Tu, W, or Th");
//             previousDate = eventDate;
//             count++;
//             if (count == 3) break;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1997-11-06T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 3, "Expected event counts don't match.");  
//     }
// );

// Deno.test("The second-to-last weekday of the month",
//     () => {   
//         const re = new RecurrenceRule("FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-2", "1997-09-29T09:00:00-04:00");
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertArrayIncludes([1,2,3,4,5], [eventDate.getUTCDay()], "Day is not Weekday");
//             previousDate = eventDate;
//             count++;
//             if (count == 7) break;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1998-03-30T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 7, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Every 3 hours from 9:00 AM to 5:00 PM on a specific day",
//     () => {   
//         const re = new RecurrenceRule("FREQ=HOURLY;INTERVAL=3;UNTIL=1997-09-02T17:00:00-04:00", "1997-09-02T09:00:00-04:00");
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1997-09-02T15:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 3, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Every 15 minutes for 6 occurrences",
//     () => {   
//         const re = new RecurrenceRule("FREQ=MINUTELY;INTERVAL=15;COUNT=6", "1997-09-29T09:00:00-04:00");
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             // difference between events if 15 minutes
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1997-09-29T10:15:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 6, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Every hour and a half for 4 occurrences",
//     () => {   
//         const re = new RecurrenceRule("FREQ=MINUTELY;INTERVAL=90;COUNT=4", start);
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             // difference between events is 90 minutes
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1997-09-02T13:30:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 4, "Expected event counts don't match.");  
//     }
// );

Deno.test("Every 20 minutes from 9:00 AM to 4:40 PM every day",
    () => {   
        const re = new RecurrenceRule("FREQ=DAILY;BYHOUR=9,10,11,12,13,14,15,16;BYMINUTE=0,20,40", start);
        const dateGenerator = re.GenerateDate();
        
        let previousDate:Date = dateGenerator.next().value;
        let count = 1;
        for (const eventDate of dateGenerator) {
            // difference between events is 20 minutes
            // no events before 0900
            // no events after 1640
            previousDate = eventDate;
            count++;
            if (count == 48) { break; }
        }
        assertEquals(previousDate.valueOf(), (new Date("1997-09-03T16:40:00-05:00")).valueOf(), "Last events don't match.");
        assertEquals(count, 48, "Expected event counts don't match.");  
    }
);

Deno.test("Every 20 minutes from 9:00 AM to 4:40 PM every day (alternate)",
    () => {   
        const re = new RecurrenceRule("FREQ=MINUTELY;INTERVAL=20;BYHOUR=9,10,11,12,13,14,15,16", start);
        const dateGenerator = re.GenerateDate();
        
        let previousDate:Date = dateGenerator.next().value;
        let count = 1;
        for (const eventDate of dateGenerator) {
            // difference between events is 20 minutes
            // no events before 0900
            // no events after 1640
            previousDate = eventDate;
            count++;
            if (count == 48) { break; }
        }
        assertEquals(previousDate.valueOf(), (new Date("1997-09-03T16:40:00-05:00")).valueOf(), "Last events don't match.");
        assertEquals(count, 48, "Expected event counts don't match.");  
    }
);

// Deno.test("Sunday and Tuesday every other week, week starts on Monday, 4 occurrences",
//     () => {   
//         const re = new RecurrenceRule("FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU,SU;WKST=MO", "1997-08-05T09:00:00-05:00");
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertArrayIncludes([0, 2], [eventDate.getUTCDay()], "Day is not Su or Tu");
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1997-08-24T09:00:00-05:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 4, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Sunday and Tuesday every other week, week starts on Sunday, 4 occurrences; changed week start",
//     () => {   
//         const re = new RecurrenceRule("FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU,SU;WKST=SU", "1997-08-05T09:00:00-05:00");
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             assertArrayIncludes([0, 2], [eventDate.getUTCDay()], "Day is not Su or Tu");
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1997-08-31T09:00:00-05:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 4, "Expected event counts don't match.");  
//     }
// );

// Deno.test("Invalid date (i.e., February 30) is ignored",
//     () => {   
//         const re = new RecurrenceRule("FREQ=MONTHLY;BYMONTHDAY=15,30;COUNT=5", "1997-01-15T09:00:00-04:00");
//         const dateGenerator = re.GenerateDate();
        
//         let previousDate:Date = dateGenerator.next().value;
//         let count = 1;
//         for (const eventDate of dateGenerator) {
//             // difference between events if 15 minutes
//             previousDate = eventDate;
//             count++;
//         }
//         assertEquals(previousDate.valueOf(), (new Date("1997-03-30T09:00:00-04:00")).valueOf(), "Last events don't match.");
//         assertEquals(count, 5, "Expected event counts don't match.");
//     }
// );

