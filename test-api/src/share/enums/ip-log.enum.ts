export enum StatusIpLog {
  ALLOW = 'allow',
  BLOCK = 'block',
}

export enum IpLogType {
  OTHER = 'Other',
  RESIDENTIAL = 'Residential',
  WIRELESS = 'Wireless',
  BUSINESS = 'Business',
  VPN = 'VPN',
  TOR = 'TOR',
}

export enum IpLogSource {
  OTHER = 'other',
  PROXY_CHECK = 'proxycheck',
  GEO_JS = 'geo',
}

export enum IpLogReason {
  IP_ADDRESS = 'IP address',
  IP_START_WITH = 'IP start with',
  COUNTRY = 'Country',
  ALL_COUNTRY = 'All countries',
  NON_EU_COUNTRY = 'All Non-EU countries',
  NON_US_COUNTRY = 'All Non-US countries',
  STATE_PROVINCE_CITY = 'State/Province/City',
  COLECTION = 'Colection',
  PRODUCT = 'Product',
  ISP = 'ISP',
  VPN_PROXY = 'VPN/Proxy',
  TOR = 'TOR',
  DEVICE = 'Device',
  REFER_URL = 'URL',
  SPY_EXTENSION = 'Spy Extension',
}

export enum IpLogVPNSourceCheck {
  OTHER = 1,
  PROXY_CHECK = 2,
  DB_INTERNAL = 3,
  DB_2_LOCATION = 4,
}

export enum IpLogDevice {
  SMART_PHONE = 1,
  TABLET = 2,
  PHABLET = 3,
  DESKTOP = 4,
}

export enum IpLogAction {
  BLOCKED = 1,
  REDIRECT = 2,
}

export enum IpSourceCheck {
  PROXY_CHECK = 1,
  IP_API_COM = 2,
  GEO_JS = 3,
  IP_API_CO = 4,
}
