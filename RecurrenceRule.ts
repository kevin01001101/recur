

enum RulePartType {
    FREQ,
    UNTIL,
    COUNT,
    INTERVAL,
    BYSECOND,
    BYMINUTE,
    BYHOUR,
    BYDAY,
    BYMONTHDAY,
    BYYEARDAY,
    BYWEEKNO,
    BYMONTH,
    BYSETPOS,
    WKST
}

type RulePartTypeStrings = keyof typeof RulePartType;

enum Frequency {
    SECONDLY,
    MINUTELY,
    HOURLY,
    DAILY,
    WEEKLY,
    MONTHLY,
    YEARLY
}

enum Weekday {
    SU,
    MO,
    TU,
    WE,
    TH,
    FR,
    SA
}

interface WeekDayNumber {
    ordinalWeek?: number;
    weekday: Weekday;
}

type RuleValue = Frequency | Weekday | number | number[] | WeekDayNumber[] | Date;
// interface RulePart {
//     type: RulePartType,
//     value?: Frequency | Weekday | number | number[] | WeekDayNumber[] | Date
// }


export class RecurrenceRule {

    rules: Map<RulePartType, RuleValue> = new Map<RulePartType, RuleValue>();
    frequency!: Frequency;
    until?: Date;
    count?: number;
    interval = 1;

    bySecond: number[] = [];
    byMinute: number[] = [];
    byHour: number[] = [];
    byDay: WeekDayNumber[] = [];
    byMonthDay: number[] = [];
    byYearDay: number[] = [];
    byWeekNo: number[] = [];
    byMonth: number[] = [];
    bySetPos: number[] = [];

    weekStart: Weekday = Weekday.MO;

    isValid = true;
    isDateOnly = false;
    start: Date = new Date();
    last: Date | undefined;

    constructor(recurString: string, start?: string) {
        this.parseRecurString(recurString.toUpperCase());
        this.start = start == undefined ? new Date() : new Date(start);
        // test to see if a time component was included in the date string
        this.isDateOnly = start != undefined && (start.indexOf('T') > 0 || start.indexOf(' ') > 0)
        this.validate(recurString);
    }



    // *[Symbol.iterator]() {

    //     const coreEventSet = new Set<Date>();
    //     coreEventSet.add(this.start);

    //     let currentTime = this.start;
    //     let eventCount = 0;
    //     while (this.until == undefined || currentTime > this.until) {

    //         const eventSet = this.getEventsByFrequency(this.frequency, currentTime);
    //         currentTime = this.getNextIntervalTime(this.frequency, currentTime);
    //         for (const evt of eventSet) {
    //             yield evt;
    //             eventCount++;
    //             if (eventCount == this.count) {
    //                 return;
    //             }
    //         }
    //     }
    // }

    private validate = (recurString: string): boolean => {
        if (this.frequency == undefined) { throw Error("The FREQ rule part is REQUIRED") }
        
        if (this.count != undefined && this.until != undefined) {
            throw Error("UNTIL and COUNT MUST NOT occurr in the same recurrence");
        }      

        if (this.frequency != Frequency.YEARLY && this.frequency != Frequency.MONTHLY && this.byDay.some(d => d.ordinalWeek != 0)) {
            throw Error("The BYDAY rule part MUST NOT be specified with a numeric value when the FREQ rule part is not set to MONTHLY or YEARLY");
        }

        if (this.frequency == Frequency.YEARLY && this.byDay.length > 0 && this.byWeekNo.length > 0) {
            throw Error("The BYDAY rule part MUST NOT be specified with a numeric value with the FREQ rule part set to YEARLY when the BYWEEKNO rule part is specified");
        }
        
        if (this.frequency == Frequency.WEEKLY && this.byMonthDay.length > 0) {
            throw Error("The BYMONTHDAY rule part MUST NOT be specified when the FREQ rule part is set to WEEKLY.");
        } 

        if ((this.frequency == Frequency.DAILY || this.frequency == Frequency.WEEKLY || this.frequency == Frequency.MONTHLY) &&
            this.byYearDay.length > 0) {
                throw Error("The BYYEARDAY rule part MUST NOT be specified when the FREQ rule part is set to DAILY, WEEKLY, or MONTHLY.");
            }            

        if (this.byWeekNo.length > 0 && this.frequency != Frequency.YEARLY) {
            throw Error("This rule part MUST NOT be used when the FREQ rule part is set to anything other than YEARLY.");
        }

        if (this.bySetPos.length > 0 && recurString.match(/BY/g)!.length < 2) {
            throw Error("BYSETPOS MUST only be used in conjunction with another BYxxx rule part.");
        }
        
        return true;
    }

    parseRecurString = (recurString: string): void => {

        // SPEC: To ensure backward compatibility with applications that pre-date this revision of
        //    iCalendar the FREQ rule part MUST be the first rule part specified in a RECUR value.
        if (!recurString.startsWith("FREQ")) {
            throw Error("The FREQ rule part MUST be the first rule part specified");
        }

        // SPEC: Individual rule parts MUST only be specified once.
        const ruleMap = new Map<RulePartType, string>();
        recurString.split(';').forEach(rp => {
            const [ruleType, ruleValue] = rp.split("=");
            const rulePartType = RulePartType[<RulePartTypeStrings>ruleType];
            if (ruleMap.has(rulePartType)) { 
                throw Error("Individual rule parts MUST only be specified once."); 
            }
            ruleMap.set(rulePartType, ruleValue);
        })

        for (const [rulePart, ruleValue] of ruleMap) {
            switch (rulePart) {
                case RulePartType.FREQ:
                    this.frequency = Frequency[<keyof typeof Frequency>ruleValue];
                    break;
                case RulePartType.UNTIL:
                    this.until = new Date(Date.parse(ruleValue));
                    if (this.until.getTime() !== this.until.getTime()) {
                        throw Error("UNTIL rule part is invalid.");
                    }
                    break;
                case RulePartType.COUNT:
                    this.count = Number(ruleValue);
                    break;
                case RulePartType.INTERVAL:
                    this.interval = Number(ruleValue);
                    break;
                case RulePartType.BYSECOND:
                    this.bySecond = ruleValue.split(',').map(v => {
                        const num = Number(v);
                        if (num < 0 || num > 60) throw Error("Invalid byseclist");
                        return num;
                    });
                    break;
                case RulePartType.BYMINUTE:
                    this.byMinute = ruleValue.split(',').map(v => {
                        const num = Number(v);
                        if (num < 0 || num > 59) throw Error("Invalid byminlist");
                        return num;
                    });
                    break;
                case RulePartType.BYHOUR:
                    this.byHour = ruleValue.split(',').map(v => {
                        const num = Number(v);
                        if (num < 0 || num > 23) throw Error("Invalid byhrlist");
                        return num;
                    });
                    break;
                case RulePartType.BYDAY:
                    // more complex....
                    console.log(ruleValue);
                    this.byDay = ruleValue.split(',').map(v => {
                        const num = Number(v.slice(0, -2));
                        if (num < -53 || num > 53) throw Error("Invalid bywdaylist");
                        return {
                            ordinalWeek: num,
                            weekday: Weekday[<keyof typeof Weekday>v.slice(-2)]
                        };
                    });
                    break;
                case RulePartType.BYMONTHDAY:
                    this.byMonthDay = ruleValue.split(',').map(v => {
                        const num = Number(v);
                        if (num < -31 || num == 0 || num > 31) throw Error("Invalid bymodaylist");
                        return num;
                    });
                    break;
                case RulePartType.BYYEARDAY:
                    this.byYearDay = ruleValue.split(',').map(v => {
                        const num = Number(v);
                        if (num < -366 || num == 0 || num > 366) throw Error("Invalid byyrdaylist");
                        return num;
                    });
                    break;
                case RulePartType.BYWEEKNO:
                    this.byWeekNo = ruleValue.split(',').map(v => {
                        const num = Number(v);
                        if (num < -53 || num == 0 || num > 53) throw Error("Invalid bywknolist");
                        return num;
                    });
                    break;
                case RulePartType.BYMONTH:
                    this.byMonth = ruleValue.split(',').map(v => {
                        const num = Number(v);
                        if (num < -12 || num == 0 || num > 12) throw Error("Invalid bymolist");
                        return num;
                    });
                    break;
                case RulePartType.BYSETPOS:
                    this.bySetPos = ruleValue.split(',').map(v => {
                        const num = Number(v);
                        if (num < -366 || num == 0 || num > 366) throw Error("Invalid bysplist");
                        return num;
                    });
                    break;
                case RulePartType.WKST:
                    this.weekStart = Weekday[<keyof typeof Weekday>ruleValue];
                    break;
                default:
                    // error
                    throw Error("Invalid Rule Type");
            }
        }
    }


    private getWeekNumber(inputDate:Date): number {
        const d = new Date(inputDate);
        d.setUTCHours(0,0,0,0);
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(d.getUTCFullYear());
        return Math.ceil((((d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7)
    }

    private getDaysFromWeekNo(weekNumber: number, targetEvent: Date, startOfWeek = 1) {
        
        const firstDay = new Date(targetEvent);
        firstDay.setUTCMonth(0);
        firstDay.setUTCDate(1);

        if (weekNumber < 0) { 
            firstDay.setUTCFullYear(firstDay.getUTCFullYear()+1);
            weekNumber++;
        }

        const dayOfWeek = firstDay.getUTCDay();
        if ((dayOfWeek + 2 + startOfWeek) % 7 < 3) {
            firstDay.setUTCDate(firstDay.getUTCDate() + 7);
        }
        firstDay.setUTCDate(firstDay.getUTCDate() - (dayOfWeek - startOfWeek));
        firstDay.setUTCDate(firstDay.getUTCDate() + (7 * (weekNumber-1)));
        console.log("Our Week STart: ", firstDay);

        const days = [];
        for (let i=0; i < 7; i++) {
            days.push(new Date(firstDay));
            firstDay.setUTCDate(firstDay.getUTCDate()+1);
        }
        return days;
    }


    private getYearDay(yearDate: Date, dayOfYear: number): Date {
        const eventDate = new Date();
        eventDate.setUTCFullYear(yearDate.getUTCFullYear());
        eventDate.setUTCMonth(0);
        eventDate.setUTCDate(dayOfYear);
        //console.log("days: " + dayOfYear + " date is: " + eventDate);
        return eventDate;
    }

    private getMonthDays(fromDate: Date, dayOfMonth: number): Date[] {
        
        const monthDays = [];
        for (let i=0; i < 12; i++) {
            const eventDate = new Date();
            eventDate.setUTCFullYear(fromDate.getUTCFullYear());
            eventDate.setUTCMonth(fromDate.getUTCMonth());
            eventDate.setUTCDate(dayOfMonth);
            monthDays.push(eventDate);
        }
        return monthDays;
    }

    /*
        Get all specified days of week for the month of the given Date
    */
    private getDaysOfWeekInMonth(sourceEvents: Set<number>, days: number[]): number[] {
        
        const resultDays: number[] = [];

        sourceEvents.forEach(sourceEvt => {
            const currentDate = new Date(sourceEvt);
            const targetMonth = currentDate.getUTCMonth();
            currentDate.setUTCDate(1);

            while (currentDate.getUTCMonth() == targetMonth) {  
                if (days.includes(currentDate.getUTCDay())) resultDays.push(currentDate.valueOf());
                currentDate.setUTCDate(currentDate.getUTCDate()+1);
            }
        });

        return resultDays;
    }

    private getDaysOfWeekInYear(targetYear: number, days: number[]): number[] {
        const resultDays = [];     

        const sourceDate = new Date(targetYear, 0, 1);
        let currentDate = new Date(sourceDate);
        let dayOfYear = 1;
        currentDate.setUTCDate(dayOfYear++);

        while (currentDate.getUTCFullYear() == targetYear) {  
            if (days.includes(currentDate.getUTCDay())) resultDays.push(currentDate.valueOf());

            currentDate = new Date(sourceDate);
            currentDate.setUTCDate(dayOfYear++);
        }
        return resultDays;
    }


    // private getEventsByFrequency(frequency: Frequency, startTime: Date): Date[] {

    //     const results = this.processEventSet(startTime, frequency).filter(r => r >= this.start);
    //     //console.log("EventSet: ", results);
    //     return results;
    // }

    private getNextIntervalTime(frequency: Frequency, currentTime: Date): Date {

        const nextTime = new Date(currentTime);
        switch (frequency) {
            case Frequency.SECONDLY:
                nextTime.setUTCSeconds(nextTime.getUTCSeconds() + this.interval);
                return nextTime;
            case Frequency.MINUTELY:
                nextTime.setUTCMinutes(nextTime.getUTCMinutes() + this.interval);
                return nextTime;
            case Frequency.HOURLY:
                nextTime.setUTCHours(nextTime.getUTCHours() + this.interval);
                return nextTime;
            case Frequency.DAILY:
                nextTime.setUTCDate(nextTime.getUTCDate() + this.interval);
                return nextTime;
            case Frequency.WEEKLY:
                nextTime.setUTCDate(nextTime.getUTCDate() + 7 * this.interval);
                return nextTime;
            case Frequency.MONTHLY:
                nextTime.setUTCMonth(nextTime.getUTCMonth() + this.interval);
                return nextTime;
            case Frequency.YEARLY:
                nextTime.setUTCFullYear(nextTime.getUTCFullYear() + this.interval);
                return nextTime;
        }
    }

    * GenerateDate(): IterableIterator<Date> {

        const coreEventSet = new Set<Date>();
        coreEventSet.add(this.start);

        let currentTime = this.start;
        let eventCount = 0;
        while (true) {
            const eventSet = this.getEventSet(currentTime, this.frequency).filter(r => r >= this.start);
            //console.log("EVENT SET: ", eventSet);
            currentTime = this.getNextIntervalTime(this.frequency, currentTime);
            for (const evt of eventSet) {
                if (this.until != undefined && evt > this.until) {
                    console.log("END: " + evt + " and until: " + this.until);
                    return;
                }
                yield evt;
                eventCount++;
                if (eventCount == this.count) {
                    return;
                }
            }
        }
    }


    private filterOnDaysOfWeek(events:Set<number>): number[] {

        const daysArray = this.byDay.map(day => day.weekday);
        // console.log("this.byDay: ", daysArray);
        // console.log("events: ", events);
        return [...events].filter(evt => {
            return daysArray.includes(new Date(evt).getUTCDay());
        });
    }


    private getByMonthEvents(sourceEvent: Date, events: Set<number>): Set<number> {
        // console.log("SourceEvent: ", sourceEvent);
        // console.log("events: ", events);
        // console.log("this by month ", this.byMonth);
        if (this.byMonth.length == 0) return events;

        const results = new Set<number>();
        if (this.frequency == Frequency.YEARLY) {
            const currentDate = new Date(sourceEvent);
            this.byMonth.forEach(m => {
                currentDate.setUTCMonth(m-1);
                // console.log("BYMONTH: ", currentDate);
                results.add(currentDate.valueOf());
            });
        } else if (this.byMonth.includes(sourceEvent.getUTCMonth()+1)) {
            results.add(sourceEvent.valueOf());
        }

        return results;
    }

    private getByWeekNoEvents(sourceEvent: Date, events: Set<number>): Set<number> {
        if (this.byWeekNo.length == 0) { return events; }

        const results = new Set<number>();
        this.byWeekNo.forEach(wk => {
            this.getDaysFromWeekNo(wk, sourceEvent).forEach(day => {
                results.add(day.valueOf());
            });
        });
        return results;
    }

    private getByYearDayEvents(sourceEvent: Date, events: Set<number>): Set<number> {
        if (this.byYearDay.length == 0) { return events; }

        const yearDayEvents = new Set<number>();
        if (this.frequency == Frequency.YEARLY) {            
            this.byYearDay.forEach(yd => {
                const byYearDayEvent = this.getYearDay(sourceEvent, yd);
                yearDayEvents.add(byYearDayEvent.valueOf());
            });
        } else if (this.byYearDay.map(d => this.getYearDay(sourceEvent, d).valueOf()).includes(sourceEvent.valueOf())) {
            yearDayEvents.add(sourceEvent.valueOf());
        }
        return yearDayEvents;
    }

    private getByMonthDayEvents(events: Set<number>): Set<number> {
        if (this.byMonthDay.length == 0) return events;
        
        const monthDayEvents = new Set<number>();
        events.forEach(evt => {
            this.byMonthDay.forEach(md => {
                const byMonthDayEvents = this.getMonthDays(new Date(evt), md);
                byMonthDayEvents.forEach(mde => monthDayEvents.add(mde.valueOf()));
            });
        });
        return monthDayEvents;
    }

    private getByDayEvents(freq: Frequency, sourceEvent: Date, events:Set<number>): Set<number> {
        if (this.byDay.length == 0) return events;

        const results = new Set<number>();
        if (freq == Frequency.YEARLY) {
            if (this.byYearDay.length > 0 || this.byMonthDay.length > 0) {
                // limit
                this.filterOnDaysOfWeek(events).forEach(r => results.add(r));
            } else if (this.byWeekNo.length > 0) {
                console.log("by week no");
                // NOT YET IMPLEMENTED

            } else if (this.byMonth.length > 0) { 
                // special expand for monthly

                const days = this.getDaysOfWeekInMonth(events, this.byDay.map(day => day.weekday));  
                // console.log("Days of week in month: ", days.map(d => new Date(d)));                  
                days.forEach(d => results.add(d));                

            } else {
                // special expand for yearly                
                const daysByYear = this.getDaysOfWeekInYear(sourceEvent.getUTCFullYear(), this.byDay.map(day => day.weekday));
                daysByYear.forEach(d => results.add(d));
            }
    
        } else if (freq == Frequency.MONTHLY) {
            if (this.byMonthDay.length > 0) {
                // limit
                this.filterOnDaysOfWeek(events).forEach(r => results.add(r));                
            } else {
                // special expand
                const days = this.getDaysOfWeekInMonth(events, this.byDay.map(day => day.weekday));
                days.forEach(d => results.add(d));
            }

        } else {
            // limit
            this.filterOnDaysOfWeek(events).forEach(r => results.add(r));
        }

        return results;
    }

    
    private getByHourEvents(events:Set<number>): Set<number> {
        if (this.byHour.length == 0) return events;

        const byHourResults = new Set<number>();        
        events.forEach(e => {
            this.byHour.forEach(h => {
                const hourEvent = new Date(e);
                hourEvent.setUTCHours(h);
                byHourResults.add(hourEvent.valueOf());
            });
        });        
        return byHourResults;
    }

    private getByMinuteEvents(events:Set<number>): Set<number> {
        if (this.byMinute.length == 0) return events;

        const byMinuteResults = new Set<number>();        
        events.forEach(e => {
            this.byMinute.forEach(m => {
                const minuteEvent = new Date(e);
                minuteEvent.setUTCMinutes(m);
                byMinuteResults.add(minuteEvent.valueOf());
            });
        });
        return byMinuteResults;
    }

    private getBySecondEvents(events:Set<number>): Set<number> {
        if (this.bySecond.length == 0) return events;

        const bySecondResults = new Set<number>();
        events.forEach(e => {            
            this.bySecond.forEach(m => {
                const minuteEvent = new Date(e);
                minuteEvent.setUTCSeconds(m);
                bySecondResults.add(minuteEvent.valueOf());
            });
        });
        return bySecondResults;
    }

    private getEventSet(sourceEvent: Date, freq: Frequency): Date[] {

        let resultEventSet = new Set<number>();
        resultEventSet.add(sourceEvent.valueOf());

        // BYMONTH
        resultEventSet = this.getByMonthEvents(sourceEvent, resultEventSet)
        //console.log("A: ", resultEventSet);

        // BYWEEKNO
        resultEventSet = this.getByWeekNoEvents(sourceEvent, resultEventSet);

        // BYYEARDAY
        resultEventSet = this.getByYearDayEvents(sourceEvent, resultEventSet);

        // BYMONTHDAY
        resultEventSet = this.getByMonthDayEvents(resultEventSet);

        // BYDAY
        resultEventSet = this.getByDayEvents(freq, sourceEvent, resultEventSet);

        // SPEC: The BYSECOND, BYMINUTE and BYHOUR rule parts MUST NOT be specified when the associated 
        //     "DTSTART" property has a DATE value type. These rule parts MUST be ignored in RECUR value
        //     that violate the above requirement (e.g., generated by applications that pre-date this 
        //     revision of iCalendar).
        if (!this.isDateOnly) {

            // BYHOUR
            resultEventSet = this.getByHourEvents(resultEventSet);
            //console.log(resultEventSet);

            // BYMINUTE
            resultEventSet = this.getByMinuteEvents(resultEventSet);
            //console.log(resultEventSet);

            // BYSECOND
            resultEventSet = this.getBySecondEvents(resultEventSet);
        }

        // BYSETPOS
        // for each set of events generated,
        // order them, then pick the events listed by the SETPOS list
        const resultArray = Array.from([...resultEventSet]).sort().map(e => new Date(e));
        if (this.bySetPos.length == 0) {
            return resultArray;
        } else {
            const result: Date[] = [];
            this.bySetPos.forEach(pos => {            
                const absolutePosition = Math.abs(pos);
                if (absolutePosition > resultArray.length) return;

                const index = (pos < 0 ? resultArray.length - Math.abs(pos) : pos - 1);
                // take this for a result.
                result.push(resultArray[index]);
            });
            return result;
        }        
    }
}