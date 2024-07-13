const {DAY_MILLISECONDS_DURATION, HOUR_MILLISECONDS_DURATION, MINUTE_MILLISECONDS_DURATION,
    SECOND_MILLISECONDS_DURATION
} = require("./constants");


export const getIssueDate = () => {
    return new Date(Date.now())
}

export const getExpirationDate = (daysUntilExpiration = 30,
                           hoursUntilExpiration = 0,
                           minutesUntilExpiration = 0,
                           secondsUntilExpiration =0) => {
    let timeAddition = daysUntilExpiration * DAY_MILLISECONDS_DURATION;
    timeAddition += hoursUntilExpiration * HOUR_MILLISECONDS_DURATION;
    timeAddition += minutesUntilExpiration * MINUTE_MILLISECONDS_DURATION;
    timeAddition += secondsUntilExpiration * SECOND_MILLISECONDS_DURATION;
    return new Date(Date.now() + timeAddition);
}

export function test() {
    const issueDate = getIssueDate()
    const expirationDate = getExpirationDate(3)
    console.log(issueDate)
    console.log(expirationDate)
    const date = new Date('2022-07-05T19:32:44.951Z')
    // const date = new Date(Date.now())
    console.log(`${expirationDate} is ${isInThePast(expirationDate) ? "in the past" : "not in the past"}`)
    console.log(`${date} is ${isInThePast(date) ? "in the past" : "not in the past"}`)

}

export const isInThePast = (dateString: string | number | Date) => {
    const date = new Date(dateString)
    return date < new Date()
}