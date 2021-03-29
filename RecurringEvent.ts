

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
    interval: number = 1;

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

    isValid: boolean = true;
    start: Date = new Date();
    last: Date | undefined;

    constructor(recurrenceString: string, start: Date, end?: Date) {
        try {
            this.parseRecurrence(recurrenceString);
            this.isValid = this.checkRecurrence();
        } catch (e) {
            console.error(e);
            this.isValid = false;
        }
        
        this.start = start;
    }


    // [Symbol.iterator](): IterableIterator<Date> {
    //     return this;
    // }

    private checkRecurrence = (): boolean => {

        if (this.frequency != Frequency.YEARLY && this.frequency != Frequency.MONTHLY && this.byDay.length > 0) return false;
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
            //const value = getRulePartValue(rulePartType, ruleValue);
            //this.rules.add(rulePart);
        });
    }

    private getNextDateTime(): Date {

        return new Date();
    }

    private nextYear(currentDateTime:Date): Date {
        if (this.byMonth.length > 0) {

        }
        return currentDateTime;
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

    // private isLeapYear(year: number) {
    //     // source: https://stackoverflow.com/questions/3220163/how-to-find-leap-year-programmatically-in-c/11595914#11595914
    //     return ((year & 3) == 0 && ((year % 25) != 0 || (year & 15) == 0));
    // }

    private getYearDay(yearDate: Date, dayOfYear: number): Date {
        let eventDate = new Date();
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

    private getDaysByMonth(targetDate: Date, days: number[]): Date[] {
        let daysByMonth = [];
        let targetMonth = targetDate.getMonth();
        let currentDate = new Date(targetDate);
        let dayOfMonth = 1;
        currentDate.setDate(dayOfMonth++);

        while (currentDate.getMonth() != targetMonth) {  
            if (days.includes(currentDate.getDay())) daysByMonth.push(currentDate);

            currentDate = new Date(targetDate);
            currentDate.setDate(dayOfMonth++);
        }
        return daysByMonth;
    }

    private getDaysByYear(targetDate: Date, days: number[]): Date[] {
        let daysByYear = [];
        let targetYear = targetDate.getFullYear();
        let currentDate = new Date(targetDate);
        let dayOfYear = 1;
        currentDate.setDate(dayOfYear++);

        while (currentDate.getFullYear() != targetYear) {  
            if (days.includes(currentDate.getDay())) daysByYear.push(currentDate);

            currentDate = new Date(targetDate);
            currentDate.setDate(dayOfYear++);
        }
        return daysByYear;
    }


    private getYearlyEvents(year:number): Set<Date> {

        let results = new Set<Date>();

        results.add(new Date(year,0,1));
        results.add(new Date(year,0,2));
        results.add(new Date(year,0,3));
        results.add(new Date(year,0,4));
        results.add(new Date(year,0,5));
        results.add(new Date(year,0,6));

        return results;
    }

    private getEventsByFrequency(frequency: Frequency, intervalTime: Date): Date[] {

        let eventSet = new Set<Date>();
        eventSet.add(intervalTime);
        let currentTime = new Date(intervalTime);
        switch (frequency) {
            case Frequency.SECONDLY:
                break;
            case Frequency.MINUTELY:
                break;
            case Frequency.HOURLY:
                break;
            case Frequency.DAILY:
                return this.processEventSet(eventSet, frequency).filter(r => r >= this.start);
            case Frequency.WEEKLY:
                break;
            case Frequency.MONTHLY:
                break;
            case Frequency.YEARLY:
                //console.log("BEFORE:", eventSet);
                let results = this.processEventSet(eventSet, frequency);
                console.log(results);
                return (results.filter(r => r >= this.start));
                
                //return results;
        }
        return [];
    }

    private getNextIntervalTime(frequency: Frequency, currentTime: Date): Date {

        let nextTime = new Date(currentTime);
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
                //nextTime.se(nextTime.getSeconds() + this.interval);
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
        let recurrenceArray: Set<Date>[] = [];

        let coreEventSet = new Set<Date>();
        coreEventSet.add(this.start);

        let currentTime = this.start;
        let eventCount = 0;
        while (this.until == undefined || currentTime > this.until) {

            let eventSet = this.getEventsByFrequency(this.frequency, currentTime);
            currentTime = this.getNextIntervalTime(this.frequency, currentTime);
            for (let evt of eventSet) {
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

    private processEventSet(events: Set<Date>, freq: Frequency): Date[] {

        let resultEventSet = new Set<number>([...events].map(e => e.valueOf()));
    
        // BYMONTH
        let byMonthEvents = new Set<number>();
        events.forEach(evt => {
            this.byMonth.forEach(m => {
                let byMonthEvent = (new Date(evt));
                byMonthEvent.setMonth(m-1);
                byMonthEvents.add(byMonthEvent.valueOf());
                //console.log(byMonthEvent);
            });
        });
        byMonthEvents.forEach(e => resultEventSet.add(e));
        //console.log("BYMONTH_Events: ", resultEventSet);

        // BYWEEKNO
        // get the distinct years in the eventSet
        //let uniqueYears = [...new Set(Array.from(events).map(d => d.getFullYear()))];
        let uniqueYearEvents: Set<Date> = new Set(this.uniqueBy(Array.from(events), (d:Date) => d.getFullYear()));

        //console.log("UniqueYears: ", uniqueYearEvents);
        let byWeekNoEvents = new Set<number>();
        uniqueYearEvents.forEach(ye => {
            // FIX: needs to use the event time on the date objs
            this.byWeekNo.forEach(wk => {
                this.getDaysFromWeekNo(wk, ye).forEach(day => {
                    byWeekNoEvents.add(day.valueOf());
                });
            });
        });
        byWeekNoEvents.forEach(e => resultEventSet.add(e));
        //console.log("RESULT: ", resultEventSet);

        // BYYEARDAY
        let byYearDayEvents = new Set<number>();
        events.forEach(evt => {
            this.byYearDay.forEach(yd => {
                let byYearDayEvent = this.getYearDay(evt, yd);
                byYearDayEvents.add(byYearDayEvent.valueOf());
            });
        });

        // BYMONTHDAY
        // valid days of the month....

        let byMonthDayEventSet = new Set<number>();
        //for each event in the event set
        events.forEach(evt => {
            this.byMonthDay.forEach(md => {
                let byMonthDayEvents = this.getMonthDays(evt, md);
                byMonthDayEvents.forEach(mde => byMonthDayEventSet.add(mde.valueOf()));
            });
        });

        // BYDAY (of week)  [if YEARLY]
        if (this.byDay.length > 0) {
            let daysArray = this.byDay.map(day => day.weekday.valueOf());
            let byDayEventSet = new Set<number>();

            if (this.byYearDay.length > 0 || this.byMonthDay.length > 0) {
                // limit
                events.forEach((val, key, setObj) => {
                    let dateDay = (new Date(val)).getDay();
                    if (!daysArray.includes(dateDay)) {
                        setObj.delete(val);
                    }
                });
            }
            if (this.byMonth.length > 0) { 
                // special expand for monthly
                events.forEach(ce => {
                    let daysByMonth = this.getDaysByMonth(ce, daysArray);
                    daysByMonth.forEach(d => byDayEventSet.add(d.valueOf()));
                });

            // What about ByWeekNo?
            // we really need to filter this somehow to avoid double duty
            } else {
                // special expand for yearly
                uniqueYearEvents.forEach(ye => {
                    let daysByYear = this.getDaysByYear(new Date(ye.getFullYear(), 0, 1), daysArray);
                    daysByYear.forEach(d => byDayEventSet.add(d.valueOf()));
                });
            }
        }

        // BYHOUR
        let byHourEventSet = new Set<number>();
        //for each event in the event set
        events.forEach(evt => {
            this.byHour.forEach(h => {
                let hourEvent = (new Date(evt)).setHours(h);
                byHourEventSet.add( hourEvent.valueOf() );
            });
        });

        let byMinuteEventSet = new Set<number>();
        //for each event in the event set
        events.forEach(evt => {
            this.byMinute.forEach(m => {
                let minuteEvent = (new Date(evt)).setMinutes(m);
                byMinuteEventSet.add( minuteEvent.valueOf() );
            });
        });

        let bySecondEventSet = new Set<number>();
        //for each event in the event set
        events.forEach(evt => {
            this.bySecond.forEach(s => {
                let secondEvent = (new Date(evt)).setSeconds(s);
                bySecondEventSet.add( secondEvent.valueOf() );
            });
        });


        // BYSETPOS
        // for each set of events generated,
        // order them, then pick the events listed by the SETPOS list
        
        this.bySetPos



        return Array.from([...resultEventSet]).sort().map(e => new Date(e));
         
    }
}