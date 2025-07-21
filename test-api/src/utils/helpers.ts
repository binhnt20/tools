import bigInt from 'big-integer';
import { IPv4CidrRange, IPv6CidrRange } from 'ip-num/IPRange';
import { IpFormat } from '../share/enums/ip-format.enum';
import * as userAgent from 'random-useragent';

const ipv4Pattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}$/,
  ipv6Pattern =
    /(?:^|(?<=\s))(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))(?=\s|$)/,
  urlPattern = /^https:\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//= ]*)$/,
  ipv4StartPattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){1,4}$/;
// ipv6StartPattern =
//   /((?:[\da-f]{0,4}:){1,7}(?:((?:(?:25[0-5]|2[0-4]\d|1?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|1?\d\d?))|[\da-f]{0,4}))/;

export const validateIPAddress = (ipAddress: string): boolean | IpFormat => {
  const ip = ipAddress?.trim();
  if (ipv4Pattern.test(ip)) return IpFormat.V4;
  if (ipv6Pattern.test(ip)) return IpFormat.V6;
  return false;
};

export const convertIPv6 = (ipAddress: string): string => {
  const binaryArray = ipAddress.split(':').map((part) => parseInt(part, 16).toString(2).padStart(16, '0')),
    binaryString = binaryArray.join('');
  return BigInt(`0b${binaryString}`).toString();
};

export const validateIPStartWith = (ipAddress: string): boolean => {
  if (!ipAddress) return false;
  if (ipv6Pattern.test(ipAddress)) return true;
  ipAddress = ipAddress.replace(/\.+$/, '');
  return ipv4StartPattern.test(ipAddress);
};

interface IDictionary<T> {
  [key: string]: T;
}
interface IIspItem {
  id: number;
  asCode?: string;
  asName?: string;
  createdAt?: Date;
}

export const genIpv6 = () => {
  const prefix = ['2402:9d80:', '2a09:bac5:', '2a09:bac3:', '2001:470:', '2406:d00:', '2001:ee0:'];
  const mac = 'XX:XX:XX:XX:XX:XX'.replace(/X/g, () => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]);
  return `${prefix[Math.floor(Math.random() * prefix.length)]}:${(mac.split(':')[0] as unknown as number) ^ 2}:${
    mac.split(':')[1]
  }:${mac.split(':')[2]}ff:fe${mac.split(':')[3]}:${mac.split(':')[4]}${mac.split(':')[5]}`;
};

export const genRandomIp = (type?: IpFormat): string => {
  const ipType = type || (Math.random() < 0.5 ? IpFormat.V4 : IpFormat.V6);
  if (ipType === IpFormat.V4) {
    return Array(4)
      .fill(0)
      .map((_, i) => Math.floor(Math.random() * 255) + (i === 0 ? 1 : 0))
      .join('.');
  } else if (ipType === IpFormat.V6) {
    return genIpv6();
  } else {
    throw new Error('Invalid IP type.');
  }
};

export const encodeIpAddress = (ipAddress: string) => {
  if (validateIPAddress(ipAddress) === IpFormat.V6) {
    const octets = ipAddress.split(':');
    octets.splice(3, 3, '****', '****');
    return octets.join(':');
  } else if (validateIPAddress(ipAddress) === IpFormat.V4) {
    const octets = ipAddress.split('.');
    octets.splice(1, 2, '***', '***');
    return octets.join('.');
  }
  return ipAddress;
};

export const genRandomDate = (): number => {
  const currentDate = new Date();
  const daysAgo = Math.floor(Math.random() * 8);
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  const seconds = Math.floor(Math.random() * 60);

  const randomDate = new Date(currentDate);
  randomDate.setDate(currentDate.getDate() - daysAgo);
  randomDate.setHours(hours);
  randomDate.setMinutes(minutes);
  randomDate.setSeconds(seconds);

  return Math.floor(randomDate.getTime() / 1000);
};

export const ipToDecimal = (ipAddress: string): string => {
  return isIPv6(ipAddress) ? ipv6ToDecimal(ipAddress) : ipv4ToDecimal(ipAddress);
};

const isIPv6 = (ipAddress: string): boolean => {
  const ipv6Pattern = /:/;
  return ipv6Pattern.test(ipAddress);
};

const ipv4ToDecimal = (ipAddress: string): string => {
  const parts = ipAddress.split('.');
  const decimal = parts.reduce((result, part, index) => {
    return result + parseInt(part) * Math.pow(256, 3 - index);
  }, 0);
  return decimal.toString();
};

const expandIPv6 = (ipv6Address: string): string => {
  let expandedAddress = ipv6Address;
  const doubleColonIndex = expandedAddress.indexOf('::');
  if (doubleColonIndex !== -1) {
    const numberOfMissingGroups = 8 - (expandedAddress.split(':').length - 1);
    let replacement = '';
    for (let i = 0; i < numberOfMissingGroups; i++) replacement += '0000:';
    expandedAddress = expandedAddress.replace('::', `:${replacement}`);
    if (expandedAddress[0] === ':') expandedAddress = `0000${expandedAddress}`;
    if (expandedAddress[expandedAddress.length - 1] === ':') expandedAddress += '0000';
  }
  const addressParts = expandedAddress.split(':');
  const paddedParts = addressParts.map((part) => part.padStart(4, '0'));
  return paddedParts.join(':');
};

const ipv6ToDecimal = (ipAddress: string): string => {
  const parts = [];
  const expandedIPv6: string = expandIPv6(ipAddress);
  expandedIPv6.split(':').forEach(function (it) {
    const hextet = it || 0;
    let bin = parseInt(hextet.toString(), 16).toString(2);
    while (bin.length < 16) {
      bin = '0' + bin;
    }
    parts.push(bin);
  });
  const bin = parts.join('');
  return bigInt(bin, 2).toString();
};
export interface IIpRageResult {
  ipPrefix: string;
  startRange: number;
  endRange: number;
}
export const extractIpRangeAWSToDecimal = (listIpPrefix: string[]): IIpRageResult[] => {
  const results: IIpRageResult[] = [];
  for (const ipPrefix of listIpPrefix) {
    if (!ipPrefix) continue;
    let ipRange: IPv4CidrRange | IPv6CidrRange;
    if (ipPrefix.includes(':')) ipRange = IPv6CidrRange.fromCidr(ipPrefix);
    ipRange = IPv4CidrRange.fromCidr(ipPrefix);
    const startRange = +ipToDecimal(ipRange.getFirst().toString()),
      endRange = +ipToDecimal(ipRange.getLast().toString());
    results.push({ ipPrefix, startRange, endRange });
  }
  return results;
};

export const ipRangeCalc = (ipCidr: string) => {
  try {
    let ipRange: IPv4CidrRange | IPv6CidrRange;
    if (ipCidr.includes(':')) ipRange = IPv6CidrRange.fromCidr(ipCidr);
    else ipRange = IPv4CidrRange.fromCidr(ipCidr);
    const startRange = ipToDecimal(ipRange.getFirst().toString()),
      endRange = ipToDecimal(ipRange.getLast().toString());
    return { startRange, endRange };
  } catch (error) {
    return null;
  }
};

export const abbreviationsNumber = (number: number) => {
  const units = [
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'K' },
  ];

  for (const { value, suffix } of units) {
    if (number >= value) {
      return (number / value).toFixed(2) + suffix;
    }
  }

  return number.toString();
};

export const delayTimer = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const splitArrayIntoSubarrays = (arr: any[], splitLength: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += splitLength) {
    result.push(arr.slice(i, i + splitLength));
  }
  return result;
};

export const obfuscateIP = (ip: string): string => {
  if (ip.includes('.')) {
    const octets = ip.split('.');
    if (octets.length === 4) {
      return `${octets[0]}.${octets[1]}.***.***`;
    }
  } else if (ip.includes(':')) {
    const segments = ip.split(':');
    const obfuscatedSegments = segments.map((segment, index) => (index >= 4 ? '****' : segment));
    return obfuscatedSegments.join(':').replace(/(:\*{4})+$/, ':****:****');
  } else {
    return ip;
  }
};

export const getRandomTimestampInLast7Days = (): number => {
  const now = Math.floor(Date.now() / 1000);
  const sevenDaysAgo = now - 7 * 24 * 60 * 60;
  const randomTimestamp = Math.floor(Math.random() * (now - sevenDaysAgo + 1)) + sevenDaysAgo;
  return randomTimestamp;
};

export const generateCIDR = (startIp: string, endIp: string) => {
  const ipToBinary = (ip: string) => {
    if (ip.includes(':')) {
      // Expand IPv6 and convert each block to binary
      const [left, right] = ip.split('::');
      const leftParts = left ? left.split(':') : [];
      const rightParts = right ? right.split(':') : [];
      const missingBlocks = 8 - (leftParts.length + rightParts.length);
      const expanded = [...leftParts, ...Array(missingBlocks).fill('0'), ...rightParts].map((part) =>
        parseInt(part || '0', 16)
          .toString(2)
          .padStart(16, '0'),
      );
      return expanded.join('');
    } else {
      // IPv4 to binary
      return ip
        .split('.')
        .map((part) => parseInt(part).toString(2).padStart(8, '0'))
        .join('');
    }
  };

  const binaryToCIDR = (binary: string, prefixLength: number, isV6: boolean) => {
    let ip: string[] | number[];
    if (isV6) {
      ip = binary.match(/.{1,16}/g).map((bin) => parseInt(bin, 2).toString(16));
      return `${ip.join(':').replace(/(:0)+$/g, '::')}/${prefixLength}`;
    } else {
      ip = binary.match(/.{1,8}/g).map((bin) => parseInt(bin, 2));
      return `${ip.join('.')}/${prefixLength}`;
    }
  };

  const startBinary = ipToBinary(startIp);
  const endBinary = ipToBinary(endIp);

  // Ensure start IP is <= end IP
  if (BigInt(`0b${startBinary}`) > BigInt(`0b${endBinary}`)) {
    throw new Error('Start IP cannot be larger than end IP');
  }

  let prefixLength = 0;
  while (startBinary[prefixLength] === endBinary[prefixLength] && prefixLength < startBinary.length) {
    prefixLength++;
  }

  // Use only the prefix for the resulting CIDR block
  const commonBinary = startBinary.substring(0, prefixLength).padEnd(startBinary.length, '0');

  return binaryToCIDR(commonBinary, prefixLength, startIp.includes(':'));
};

export const decimalToIP = (decimal: bigint, isIPv6: boolean = false): string => {
  if (!isIPv6) {
    // Convert IPv4
    if (decimal > BigInt(4294967295) || decimal < BigInt(0)) {
      throw new Error('Invalid IPv4 decimal range');
    }
    const octets = [];
    for (let i = 3; i >= 0; i--) {
      const shift = BigInt(i * 8);
      octets.push(Number((decimal >> shift) & BigInt(255)));
    }
    return octets.join('.');
  } else {
    // Convert IPv6
    if (decimal < BigInt(0) || decimal > BigInt('0xffffffffffffffffffffffffffffffff')) {
      throw new Error('Invalid IPv6 decimal range');
    }
    const segments = [];
    for (let i = 0; i < 8; i++) {
      const shift = BigInt((7 - i) * 16);
      segments.push(((decimal >> shift) & BigInt(0xffff)).toString(16));
    }
    return segments
      .join(':')
      .replace(/(^|:)0(:0)*:0(:|$)/, '::')
      .replace(/:{3,}/, '::');
  }
};

export const getWeekUnixTimestamps = (): { startOfWeek: number; endOfWeek: number } => {
  const now = new Date();

  // Calculate the difference to the start of the week (Monday)
  const dayOfWeek = now.getDay();
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;

  // Start of the week (Monday 0:00)
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  // End of the week (Sunday 23:59:59)
  const endOfWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return {
    startOfWeek: Math.floor(startOfWeek.getTime() / 1000),
    endOfWeek: Math.floor(endOfWeek.getTime() / 1000),
  };
};

export const calcRemainingTrialDays = (trialEndsOn: Date | string) => {
  const now = new Date().getTime();
  const trialEndsOnTimeStamp = new Date(trialEndsOn).getTime();
  return Math.max(0, Math.ceil((trialEndsOnTimeStamp - now) / (1000 * 60 * 60 * 24)));
};

export const generateVersionName = (): string => {
  const now = new Date();
  const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, '');
  const hhmmss = now.toTimeString().slice(0, 8).replace(/:/g, '');
  return `v${yyyymmdd}.${hhmmss}`;
};

export const isoTimeString = (time?: Date | string | number): string => {
  if (!time) time = Date.now();
  return new Date(time).toISOString();
};

// get IP range from start and end decimal
const isIPv4 = (decimalStr: number): boolean => {
  const decimal = BigInt(decimalStr);
  return decimal <= BigInt(0xffffffff); // 32-bit
};

// Convert decimal → IPv4
const decimalToIPv4 = (decimalStr: string): string => {
  const ip = Number(decimalStr);
  return [(ip >> 24) & 255, (ip >> 16) & 255, (ip >> 8) & 255, ip & 255].join('.');
};

// Convert decimal → IPv6
const decimalToIPv6 = (decimalStr: string): string => {
  let bigInt = BigInt(decimalStr);
  const parts: string[] = [];

  for (let i = 0; i < 8; i++) {
    const part = (bigInt >> BigInt(112 - i * 16)) & BigInt(0xffff);
    parts.push(part.toString(16).padStart(4, '0'));
  }

  // Optional: rút gọn chuỗi 0 thành ::
  return parts.join(':').replace(/\b(?:0000:){2,}/, '::');
};

// Hàm chính
export const getIPRange = (startRange: number, endRange: number): string[] => {
  const start = BigInt(startRange);
  const end = BigInt(endRange);

  if (start > end) {
    throw new Error('startRange must be <= endRange');
  }

  const isV4 = isIPv4(startRange);
  const result: string[] = [];

  let current = start;
  while (current <= end) {
    result.push(isV4 ? decimalToIPv4(current.toString()) : decimalToIPv6(current.toString()));
    current += BigInt(1);
  }

  return result;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getRandomUserAgent = (): string => {
  const userAgentList = userAgent.getRandom();
  return (
    userAgentList ||
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
  );
};

export const randomArray = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getRandomIP = (): string => {
  const isIPv6 = Math.random() < 0.5;
  return isIPv6 ? getRandomPublicIPv6() : getRandomPublicIPv4();
};

// Tạo IPv4 công khai
const getRandomPublicIPv4=(): string =>{
  while (true) {
    const octets = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256));
    const [a, b] = octets;

    // Loại trừ IP local/internal
    if (
      a === 10 || // 10.0.0.0/8
      (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12
      (a === 192 && b === 168) || // 192.168.0.0/16
      a === 127 || // 127.0.0.0/8 (loopback)
      a === 0 // 0.0.0.0/8 (invalid)
    ) {
      continue;
    }

    return octets.join('.');
  }
}

// Tạo IPv6 công khai
function getRandomPublicIPv6(): string {
  while (true) {
    const hextets = Array.from({ length: 8 }, () => Math.floor(Math.random() * 0x10000).toString(16));

    const first = parseInt(hextets[0], 16);

    // Loại trừ fc00::/7 và ::1 (loopback)
    if (
      (first & 0xfe00) === 0xfc00 || // fc00::/7
      hextets.join(':') === '0:0:0:0:0:0:0:1'
    ) {
      continue;
    }

    return hextets.join(':');
  }
}
