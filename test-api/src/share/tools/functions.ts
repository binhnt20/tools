import * as qs from 'qs';

export const objectToQuerystring = (obj = {}) => {
  return qs.stringify(obj);
};

export const cleanTrackingCompany = (str) => {
  str = str.replace(/'/g, '');
  str = str.replace(/"/g, '');
  str = str.replace(/`/g, '');
  str = str.replace(/(\s+)/g, '');
  str = str.trim();
  return str;
};

export const cleanString = (str) => {
  str = str.replace(/\|/g, '');
  str = str.replace(/\)/g, '');
  str = str.replace(/\(/g, '');
  str = str.replace(/ /g, '');
  str = str.replace(/&/g, '');
  str = str.replace(/'/g, '');
  str = str.replace(/"/g, '');
  str = str.replace(/\//g, '');
  str = str.replace(/(\/t)/g, '');
  str = str.replace(/(\\t)/g, '');
  str = str.replace(/(\/n)/g, '');
  str = str.replace(/(\/r)/g, '');
  str = str.replace(/\[/g, '');
  str = str.replace(/\]/g, '');
  str = str.replace(/(\\\\)/g, '');
  return str;
};

export const cleanTrackingUrl = (str) => {
  str = str.replace(/[\x00-\x1F\x7F-\xFF]/g, '');
  str = str.replace(/ /g, '');
  return str;
};

export const hiddenString = (originString: string, start?: number, end?: number, hiddenCharacter?: string) => {
  if (!hiddenCharacter) hiddenCharacter = '*';
  if (!start) start = 0;
  if (!end) end = originString.length;
  const first = originString.slice(0, start);
  const countReplaceString = originString.slice(start, end).length;
  const last = originString.slice(end);
  return first + hiddenCharacter.repeat(countReplaceString) + last;
};

export const uniqueArrayObject = (array: object[], key: string) => {
  const uniqueObject = array.reduce((result, current) => {
    const uniqueValue = current[key];
    if (!result[uniqueValue]) result[uniqueValue] = current;
    return result;
  }, {});
  return Object.values(uniqueObject);
};

export const unixTimestamp = (time?: Date | number | string) => {
  let timestamp = new Date(Number(time) || time).getTime();
  if (!timestamp || !time) timestamp = Date.now();
  return Math.floor(timestamp / 1000);
};

export const formatDateString = (time?: Date | number | string, format: string = 'yyyy-mm-dd') => {
  let timestamp = new Date(Number(time) || time).getTime();
  if (!timestamp || !time) timestamp = Date.now();
  const date = new Date(timestamp);
  const year = String(date.getFullYear());
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  format = format.replace('yyyy', year);
  format = format.replace('mm', month);
  format = format.replace('dd', day);
  return format;
};

export const parseQueryFromUrl = (url) => {
  let querystring;
  const query = {};
  try {
    querystring = new URL(url).search;
  } catch (e) {
    return null;
  }
  const pairs = (querystring[0] === '?' ? querystring.substr(1) : querystring).split('&');
  for (let i = 0; i < pairs.length; i++) {
    const [key, value] = pairs[i].split('=');
    query[decodeURIComponent(key)] = decodeURIComponent(value || '');
  }
  return query;
};

export const formatPaginationRequest = (page: number, perPage: number): { skip: number; take?: number } => {
  if (perPage === -1) return { skip: undefined, take: undefined };
  const skip = Math.max((page - 1) * perPage, 0);
  const take = perPage === -1 ? undefined : perPage;
  return { skip, take };
};

export const formatTime = (time: Date | number | string, option: 'start' | 'end'): Date => {
  let date = new Date(time);
  if (!date.getTime()) date = new Date();
  if (option === 'start') date.setHours(0, 0, 0, 0);
  else if (option === 'end') date.setHours(23, 59, 59, 999);
  return date;
};

/**
 * Convert timezone name like Asia/Saigon to +07:00
 * @param timezoneName
 * @returns string
 */
export const convertTimezoneName = (timeZone: string): string => {
  const dateParts = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' }).formatToParts(new Date());
  const timezone = dateParts.find((part) => part.type === 'timeZoneName')?.value;
  //Example timezone: GMT-2:30 or GMT+7
  if (!timezone) return '+00:00';
  const splitTimezone = timezone.match(/GMT([+-])(\d+)(?::(\d\d))?/) || [];
  const sign = splitTimezone[1] || '+';
  const hours = splitTimezone[2] ? splitTimezone[2].padStart(2, '0') : '00';
  const minutes = splitTimezone[3] ? splitTimezone[3].padStart(2, '0') : '00';
  return `${sign}${hours}:${minutes}`;
};
