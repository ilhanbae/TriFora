/* This method converts ISO 8601 DateTime string into calendar date format following
user's preferred locale setting by their browser

Note:
- The ISO 8601 Date is represented as follows: [YYYY]-[MM]-[DD]-T[hh]:[mm]:[ss].[TZD]
  ex. 2023-02-14T19:10:58.826Z
- The Calendar Date is represented as follows: [Month] [DD],[YYYY]
  ex. February 14, 2023
- The Military Time (24 hour clock) is represented as follows: [hh]:[mm]:[ss]
  ex. 19:10:58

Read more about ISO 8601 Date Standard here: https://en.wikipedia.org/wiki/ISO_8601
*/
export default function formatDateTime(dateTime) {
  const userLocale = navigator.language;
  const dateTimeObject = new Date(dateTime);
  const dateTimeCalendarFormat = dateTimeObject.toLocaleString(userLocale, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // console.log(dateTimeCalendarFormat)
  return(dateTimeCalendarFormat)
}