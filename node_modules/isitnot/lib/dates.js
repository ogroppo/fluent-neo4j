isDate = arg => {
  if (Array.isArray(arg) || !arg) return false;
  let isDate = false;

  if (arg instanceof Date) {
    try {
      isDate = isNaN(arg.getTime()) === false;
    } catch (e) {
      isDate = false;
      catchError(e);
    }

    return isDate;
  }

  if (typeof arg === 'string') {
    let dateString = arg.trim();

    const validISOFormat = ((
      dateSeparator = '-',
      dateTimeSeparator = 'T',
      timeSeparator = ':'
    ) => {
      const year = '\\d{4}';
      const month = '(0[1-9]|1[0-2])';
      const day = '([0-2][1-9]|[0-3][0-1])';
      const hours = '(([0-1][0-9])|(2[0-3]))';
      const minutes = timeSeparator + '([0-5][0-9])';
      const seconds = timeSeparator + '([0-5][0-9])';
      const milliseconds = '.([0-9]{3})Z';
      const time = '(' + hours + minutes + seconds + milliseconds + ')';
      const date =
        '(' + year + dateSeparator + month + dateSeparator + day + ')';

      return new RegExp(
        // prettier-ignore
        '(^' + date + '$)' +
        '|(^' + date + dateTimeSeparator + time + '$)' +
        '|(^' + date + dateTimeSeparator + hours + minutes + '$)' +
        '|(^' + date + dateTimeSeparator + hours + minutes + seconds + '$)' +
        '|(^' + date + dateTimeSeparator +
        hours + minutes + seconds + milliseconds + '$)'
      );
    })();

    try {
      isDate = validISOFormat.test(dateString);
    } catch (e) {
      isDate = false;
      catchError(e);
    } finally {
      isDate =
        isDate &&
        new Date(dateString).toISOString().match(new RegExp(dateString));
    }

    return isDate;
  }

  function catchError(e) {
    return console && typeof console.error === 'function' && console.error(e);
  }

  return isDate;
};

isNotDate = arg => !isDate(arg);
