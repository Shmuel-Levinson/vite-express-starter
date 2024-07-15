const {
    DAY_MILLISECONDS_DURATION, HOUR_MILLISECONDS_DURATION, MINUTE_MILLISECONDS_DURATION,
    SECOND_MILLISECONDS_DURATION
} = require("./constants");


export const getIssueDate = () => {
    return new Date(Date.now())
}

export const getExpirationDate = (daysUntilExpiration = 30,
                                  hoursUntilExpiration = 0,
                                  minutesUntilExpiration = 0,
                                  secondsUntilExpiration = 0) => {
    let timeAddition = daysUntilExpiration * DAY_MILLISECONDS_DURATION;
    timeAddition += hoursUntilExpiration * HOUR_MILLISECONDS_DURATION;
    timeAddition += minutesUntilExpiration * MINUTE_MILLISECONDS_DURATION;
    timeAddition += secondsUntilExpiration * SECOND_MILLISECONDS_DURATION;
    return new Date(Date.now() + timeAddition);
}

export function nowWithDelta({seconds, minutes, hours, days}: {
    seconds?: number,
    minutes?: number,
    hours?: number,
    days?: number
}) {
    let timeAddition = (days || 0) * DAY_MILLISECONDS_DURATION;
    timeAddition += (hours || 0) * HOUR_MILLISECONDS_DURATION;
    timeAddition += (minutes || 0) * MINUTE_MILLISECONDS_DURATION;
    timeAddition += (seconds || 0) * SECOND_MILLISECONDS_DURATION;
    return new Date(Date.now() + timeAddition);

}

export function test() {
    const issueDate = getIssueDate()
    // const expirationDate = getExpirationDate(3)
    const futureDate = nowWithDelta({days: 20})
    console.log(issueDate)
    console.log(futureDate)
    const pastDate = nowWithDelta({seconds: -10})
    // const date = new Date(Date.now())
    console.log(`${futureDate} is ${isInThePast(futureDate) ? "in the past" : "not in the past"}`)
    console.log(`${pastDate} is ${isInThePast(pastDate) ? "in the past" : "not in the past"}`)

}

export const isInThePast = (dateString: string | number | Date) => {
    const date = new Date(dateString)
    return date < new Date()
}