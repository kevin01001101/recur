

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


export class RecurringEvent {

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
    start: Date = new Date();
    last: Date | undefined;

    constructor(recurrenceString: string, start?: Date, end?: Date) {
        //try {
        this.parseRecurrence(recurrenceString);
        this.validateRecurrence();
        // } catch (e) {
        //     console.error(e);
        //     this.isValid = false;
        // }
        
        if (start != undefined) this.start = start;
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

    private validateRecurrence = (): boolean => {
        if (this.frequency == undefined) { throw Error("The FREQ rule part is REQUIRED") }        

        if (this.frequency != Frequency.YEARLY && this.frequency != Frequency.MONTHLY && this.byDay.some(d => d.ordinalWeek != 0)) return false;
        if (this.frequency == Frequency.YEARLY && this.byDay.length > 0 && this.byWeekNo.length > 0) return false;
        
        if (this.frequency == Frequency.WEEKLY && this.byMonthDay.length > 0) return false;

        if ((this.frequency == Frequency.DAILY || this.frequency == Frequency.WEEKLY || this.frequency == Frequency.MONTHLY) &&
            this.byYearDay.length > 0) return false;

        if (this.byWeekNo.length > 0 && this.frequency != Frequency.YEARLY) return false;        

        return true;
    }

    parseRecurrence = (recurrenceRule: string): void => {

        const ruleParts = recurrenceRule.split(';');
        ruleParts.map(rp => {
            const [ruleType, ruleValue] = rp.split("=");
            const rulePartType = RulePartType[<RulePartTypeStrings>ruleType];

            switch (rulePartType) {
                case RulePartType.FREQ:
                    this.frequency = Frequency[<keyof typeof Frequency>ruleValue];
                    break;
                case RulePartType.UNTIL:
                    this.until = new Date(Date.parse(ruleValue));
                    break;
                case RulePartType.COUNT:
                    this.count = Number(ruleValue);
                    break;
                case RulePartType.INTERVAL:
                    this.interval = Number(ruleValue);
                    break;
                case RulePartType.BYSECOND:
                    this.bySecond = ruleValue.split(',').map(v => {
                        let num = Number(v);
                        if (num < 0 || num > 60) throw Error("Invalid byseclist");
                        return num;
                    });
                    break;
                case RulePartType.BYMINUTE:
                    this.byMinute = ruleValue.split(',').map(v => {
                        let num = Number(v);
                        if (num < 0 || num > 59) throw Error("Invalid byminlist");
                        return num;
                    });
                    break;
                case RulePartType.BYHOUR:
                    this.byHour = ruleValue.split(',').map(v => {
                        let num = Number(v);
                        if (num < 0 || num > 23) throw Error("Invalid byhrlist");
                        return num;
                    });
                    break;
                case RulePartType.BYDAY:
                    // more complex....
                    console.log(ruleValue);
                    this.byDay = ruleValue.split(',').map(v => {
                        let num = Number(v.slice(0, -2));
                        let day = Weekday[<keyof typeof Weekday>v.slice(-2)];
                        if (num < -53 || num > 53) throw Error("Invalid bywdaylist");
                        
                        return {
                            ordinalWeek: num,
                            weekday: day
                        };
                    });
                    break;
                case RulePartType.BYMONTHDAY:
                    this.byMonthDay = ruleValue.split(',').map(v => {
                        let num = Number(v);
                        if (num < -31 || num == 0 || num > 31) throw Error("Invalid bymodaylist");
                        return num;
                    });
                    break;
                case RulePartType.BYYEARDAY:
                    this.byYearDay = ruleValue.split(',').map(v => {
                        let num = Number(v);
                        if (num < -366 || num == 0 || num > 366) throw Error("Invalid byyrdaylist");
                        return num;
                    });
                    break;
                case RulePartType.BYWEEKNO:
                    this.byWeekNo = ruleValue.split(',').map(v => {
                        let num = Number(v);
                        if (num < -53 || num == 0 || num > 53) throw Error("Invalid bywknolist");
                        return num;
                    });
                    break;
                case RulePartType.BYMONTH:
                    this.byMonth = ruleValue.split(',').map(v => {
                        let num = Number(v);
                        if (num < -12 || num == 0 || num > 12) throw Error("Invalid bymolist");
                        return num;
                    });
                    break;
                case RulePartType.BYSETPOS:
                    this.bySetPos = ruleValue.split(',').map(v => {
                        let num = Number(v);
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
        });
    }


    private getWeekNumber(inputDate:Date): number {
        let d = new Date(inputDate);
        d.setHours(0,0,0,0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        let yearStart = new Date(d.getFullYear());
        return Math.ceil((((d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7)
    }

    private getDaysFromWeekNo(weekNumber: number, targetEvent: Date, startOfWeek: number = 1) {
        
        let firstDay = new Date(targetEvent);
        firstDay.setMonth(0);
        firstDay.setDate(1);

        if (weekNumber < 0) { 
            firstDay.setFullYear(firstDay.getFullYear()+1);
            weekNumber++;
        }

        const dayOfWeek = firstDay.getDay();
        if ((dayOfWeek + 2 + startOfWeek) % 7 < 3) {
            firstDay.setDate(firstDay.getDate() + 7);
        }
        firstDay.setDate(firstDay.getDate() - (dayOfWeek - startOfWeek));
        firstDay.setDate(firstDay.getDate() + (7 * (weekNumber-1)));
        console.log("Our Week STart: ", firstDay);

        let days = [];
        for (let i=0; i < 7; i++) {
            days.push(new Date(firstDay));
            firstDay.setDate(firstDay.getDate()+1);
        }
        return days;
    }


    private getYearDay(yearDate: Date, dayOfYear: number): Date {
        const eventDate = new Date();
        eventDate.setFullYear(yearDate.getFullYear());
        eventDate.setMonth(0);
        eventDate.setDate(dayOfYear);
        //console.log("days: " + dayOfYear + " date is: " + eventDate);
        return eventDate;
    }

    private getMonthDays(fromDate: Date, dayOfMonth: number): Date[] {
        
        let monthDays = [];
        for (let i=0; i < 12; i++) {
            let eventDate = new Date();
            eventDate.setFullYear(fromDate.getFullYear());
            eventDate.setMonth(fromDate.getMonth());
            eventDate.setDate(dayOfMonth);
            monthDays.push(eventDate);
        }
        return monthDays;
    }

    /*
        Get all specified days of week for the month of the given Date
    */
    private getDaysOfWeekInMonth(sourceDate: Date, days: number[]): number[] {
        
        const resultDays = [];
        const currentDate = new Date(sourceDate);
        const targetMonth = currentDate.getMonth();
        currentDate.setDate(1);

        while (currentDate.getMonth() == targetMonth) {  
            if (days.includes(currentDate.getDay())) resultDays.push(currentDate.valueOf());
            currentDate.setDate(currentDate.getDate()+1);
        }
        return resultDays;
    }

    private getDaysOfWeekInYear(targetYear: number, days: number[]): number[] {
        const resultDays = [];     

        const sourceDate = new Date(targetYear, 0, 1);
        let currentDate = new Date(sourceDate);
        let dayOfYear = 1;
        currentDate.setDate(dayOfYear++);

        while (currentDate.getFullYear() == targetYear) {  
            if (days.includes(currentDate.getDay())) resultDays.push(currentDate.valueOf());

            currentDate = new Date(sourceDate);
            currentDate.setDate(dayOfYear++);
        }
        return resultDays;
    }


    private getEventsByFrequency(frequency: Frequency, startTime: Date): Date[] {

        const results = this.processEventSet(startTime, frequency).filter(r => r >= this.start);
        console.log("EventSet: ", results);
        return results;
    }

    private getNextIntervalTime(frequency: Frequency, currentTime: Date): Date {

        const nextTime = new Date(currentTime);
        switch (frequency) {
            case Frequency.SECONDLY:
                nextTime.setSeconds(nextTime.getSeconds() + this.interval);
                return nextTime;
            case Frequency.MINUTELY:
                nextTime.setMinutes(nextTime.getMinutes() + this.interval);
                return nextTime;
            case Frequency.HOURLY:
                nextTime.setHours(nextTime.getHours() + this.interval);
                return nextTime;
            case Frequency.DAILY:
                nextTime.setDate(nextTime.getDate() + this.interval);
                return nextTime;
            case Frequency.WEEKLY:
                nextTime.setDate(nextTime.getDate() + 7 * this.interval);
                return nextTime;
            case Frequency.MONTHLY:
                nextTime.setMonth(nextTime.getMonth() + this.interval);
                return nextTime;
            case Frequency.YEARLY:
                nextTime.setFullYear(nextTime.getFullYear() + this.interval);
                return nextTime;
        }
    }

    * GenerateDate(): IterableIterator<Date> {

        const coreEventSet = new Set<Date>();
        coreEventSet.add(this.start);

        let currentTime = this.start;
        let eventCount = 0;
        while (this.until == undefined || currentTime > this.until) {

            const eventSet = this.getEventsByFrequency(this.frequency, currentTime);
            currentTime = this.getNextIntervalTime(this.frequency, currentTime);
            for (const evt of eventSet) {
                yield evt;
                eventCount++;
                if (eventCount == this.count) {
                    return;
                }
            }
        }
    }

    private uniqueBy(a:any, key:any) {
        let seen = new Set();
        return a.filter((item:any) => {
            let k = key(item);
            return seen.has(k) ? false : seen.add(k);
        });
    }

    private filterOnDaysOfWeek(events:Set<number>): number[] {

        const daysArray = this.byDay.map(day => day.weekday);
        // console.log("this.byDay: ", daysArray);
        // console.log("events: ", events);
        return [...events].filter(evt => {
            return daysArray.includes(new Date(evt).getDay());
        });
    }



    private getByMonthEvents(sourceEvent: Date, events: Set<number>): Set<number> {
        if (this.byMonth.length == 0) return events;

        const results = new Set<number>();
        if (this.frequency == Frequency.YEARLY) {
            const currentDate = new Date(sourceEvent);
            this.byMonth.forEach(m => {
                currentDate.setMonth(m-1);
                results.add(currentDate.valueOf());
            });
        } else if (this.byMonth.includes(sourceEvent.getMonth())) {
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
                const days = this.getDaysOfWeekInMonth(sourceEvent, this.byDay.map(day => day.weekday));                    
                days.forEach(d => results.add(d));                

            } else {
                // special expand for yearly                
                const daysByYear = this.getDaysOfWeekInYear(sourceEvent.getFullYear(), this.byDay.map(day => day.weekday));
                daysByYear.forEach(d => results.add(d));
            }
    
        } else if (freq == Frequency.MONTHLY) {
            if (this.byMonthDay.length > 0) {
                // limit
                this.filterOnDaysOfWeek(events).forEach(r => results.add(r));                
            } else {
                // special expand
                const days = this.getDaysOfWeekInMonth(sourceEvent, this.byDay.map(day => day.weekday));
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
                hourEvent.setHours(h);
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
                minuteEvent.setMinutes(m);
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
                minuteEvent.setSeconds(m);
                bySecondResults.add(minuteEvent.valueOf());
            });
        });
        return bySecondResults;
    }

    private processEventSet(sourceEvent: Date, freq: Frequency): Date[] {

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

        // BYHOUR
        resultEventSet = this.getByHourEvents(resultEventSet);
        //console.log(resultEventSet);

        // BYMINUTE
        resultEventSet = this.getByMinuteEvents(resultEventSet);
        //console.log(resultEventSet);

        // BYSECOND
        resultEventSet = this.getBySecondEvents(resultEventSet);

        //console.log("C:", resultEventSet);
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