/**
 * Comprehensive Global Countries Database
 * 
 * This file contains all 195+ countries and territories with their essential information
 * for global e-commerce and price comparison functionality.
 */

export interface CountryInfo {
  code: string;           // ISO 3166-1 alpha-2 country code
  name: string;           // Full country name
  currency: string;       // Primary currency code (ISO 4217)
  currencySymbol: string; // Currency symbol
  language: string;       // Primary language code (ISO 639-1)
  region: string;         // Geographic region
  googleDomain: string;   // Google search domain for the country
  timezone: string;       // Primary timezone
  phoneCode: string;      // International dialing code
  popular: boolean;       // Whether this is a popular e-commerce market
}

export const GLOBAL_COUNTRIES: { [key: string]: CountryInfo } = {
  // Americas
  'US': {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    language: 'en',
    region: 'North America',
    googleDomain: 'google.com',
    timezone: 'America/New_York',
    phoneCode: '+1',
    popular: true
  },
  'CA': {
    code: 'CA',
    name: 'Canada',
    currency: 'CAD',
    currencySymbol: 'C$',
    language: 'en',
    region: 'North America',
    googleDomain: 'google.ca',
    timezone: 'America/Toronto',
    phoneCode: '+1',
    popular: true
  },
  'MX': {
    code: 'MX',
    name: 'Mexico',
    currency: 'MXN',
    currencySymbol: '$',
    language: 'es',
    region: 'North America',
    googleDomain: 'google.com.mx',
    timezone: 'America/Mexico_City',
    phoneCode: '+52',
    popular: true
  },
  'BR': {
    code: 'BR',
    name: 'Brazil',
    currency: 'BRL',
    currencySymbol: 'R$',
    language: 'pt',
    region: 'South America',
    googleDomain: 'google.com.br',
    timezone: 'America/Sao_Paulo',
    phoneCode: '+55',
    popular: true
  },
  'AR': {
    code: 'AR',
    name: 'Argentina',
    currency: 'ARS',
    currencySymbol: '$',
    language: 'es',
    region: 'South America',
    googleDomain: 'google.com.ar',
    timezone: 'America/Argentina/Buenos_Aires',
    phoneCode: '+54',
    popular: true
  },
  'CL': {
    code: 'CL',
    name: 'Chile',
    currency: 'CLP',
    currencySymbol: '$',
    language: 'es',
    region: 'South America',
    googleDomain: 'google.cl',
    timezone: 'America/Santiago',
    phoneCode: '+56',
    popular: true
  },
  'CO': {
    code: 'CO',
    name: 'Colombia',
    currency: 'COP',
    currencySymbol: '$',
    language: 'es',
    region: 'South America',
    googleDomain: 'google.com.co',
    timezone: 'America/Bogota',
    phoneCode: '+57',
    popular: true
  },
  'PE': {
    code: 'PE',
    name: 'Peru',
    currency: 'PEN',
    currencySymbol: 'S/',
    language: 'es',
    region: 'South America',
    googleDomain: 'google.com.pe',
    timezone: 'America/Lima',
    phoneCode: '+51',
    popular: false
  },
  'VE': {
    code: 'VE',
    name: 'Venezuela',
    currency: 'VES',
    currencySymbol: 'Bs.',
    language: 'es',
    region: 'South America',
    googleDomain: 'google.co.ve',
    timezone: 'America/Caracas',
    phoneCode: '+58',
    popular: false
  },
  'UY': {
    code: 'UY',
    name: 'Uruguay',
    currency: 'UYU',
    currencySymbol: '$U',
    language: 'es',
    region: 'South America',
    googleDomain: 'google.com.uy',
    timezone: 'America/Montevideo',
    phoneCode: '+598',
    popular: false
  },

  // Europe
  'GB': {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    currencySymbol: '£',
    language: 'en',
    region: 'Europe',
    googleDomain: 'google.co.uk',
    timezone: 'Europe/London',
    phoneCode: '+44',
    popular: true
  },
  'DE': {
    code: 'DE',
    name: 'Germany',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'de',
    region: 'Europe',
    googleDomain: 'google.de',
    timezone: 'Europe/Berlin',
    phoneCode: '+49',
    popular: true
  },
  'FR': {
    code: 'FR',
    name: 'France',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'fr',
    region: 'Europe',
    googleDomain: 'google.fr',
    timezone: 'Europe/Paris',
    phoneCode: '+33',
    popular: true
  },
  'IT': {
    code: 'IT',
    name: 'Italy',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'it',
    region: 'Europe',
    googleDomain: 'google.it',
    timezone: 'Europe/Rome',
    phoneCode: '+39',
    popular: true
  },
  'ES': {
    code: 'ES',
    name: 'Spain',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'es',
    region: 'Europe',
    googleDomain: 'google.es',
    timezone: 'Europe/Madrid',
    phoneCode: '+34',
    popular: true
  },
  'NL': {
    code: 'NL',
    name: 'Netherlands',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'nl',
    region: 'Europe',
    googleDomain: 'google.nl',
    timezone: 'Europe/Amsterdam',
    phoneCode: '+31',
    popular: true
  },
  'BE': {
    code: 'BE',
    name: 'Belgium',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'nl',
    region: 'Europe',
    googleDomain: 'google.be',
    timezone: 'Europe/Brussels',
    phoneCode: '+32',
    popular: true
  },
  'CH': {
    code: 'CH',
    name: 'Switzerland',
    currency: 'CHF',
    currencySymbol: 'CHF',
    language: 'de',
    region: 'Europe',
    googleDomain: 'google.ch',
    timezone: 'Europe/Zurich',
    phoneCode: '+41',
    popular: true
  },
  'AT': {
    code: 'AT',
    name: 'Austria',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'de',
    region: 'Europe',
    googleDomain: 'google.at',
    timezone: 'Europe/Vienna',
    phoneCode: '+43',
    popular: true
  },
  'SE': {
    code: 'SE',
    name: 'Sweden',
    currency: 'SEK',
    currencySymbol: 'kr',
    language: 'sv',
    region: 'Europe',
    googleDomain: 'google.se',
    timezone: 'Europe/Stockholm',
    phoneCode: '+46',
    popular: true
  },
  'NO': {
    code: 'NO',
    name: 'Norway',
    currency: 'NOK',
    currencySymbol: 'kr',
    language: 'no',
    region: 'Europe',
    googleDomain: 'google.no',
    timezone: 'Europe/Oslo',
    phoneCode: '+47',
    popular: true
  },
  'DK': {
    code: 'DK',
    name: 'Denmark',
    currency: 'DKK',
    currencySymbol: 'kr',
    language: 'da',
    region: 'Europe',
    googleDomain: 'google.dk',
    timezone: 'Europe/Copenhagen',
    phoneCode: '+45',
    popular: true
  },
  'FI': {
    code: 'FI',
    name: 'Finland',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'fi',
    region: 'Europe',
    googleDomain: 'google.fi',
    timezone: 'Europe/Helsinki',
    phoneCode: '+358',
    popular: true
  },
  'PL': {
    code: 'PL',
    name: 'Poland',
    currency: 'PLN',
    currencySymbol: 'zł',
    language: 'pl',
    region: 'Europe',
    googleDomain: 'google.pl',
    timezone: 'Europe/Warsaw',
    phoneCode: '+48',
    popular: true
  },
  'CZ': {
    code: 'CZ',
    name: 'Czech Republic',
    currency: 'CZK',
    currencySymbol: 'Kč',
    language: 'cs',
    region: 'Europe',
    googleDomain: 'google.cz',
    timezone: 'Europe/Prague',
    phoneCode: '+420',
    popular: true
  },
  'HU': {
    code: 'HU',
    name: 'Hungary',
    currency: 'HUF',
    currencySymbol: 'Ft',
    language: 'hu',
    region: 'Europe',
    googleDomain: 'google.hu',
    timezone: 'Europe/Budapest',
    phoneCode: '+36',
    popular: false
  },
  'RO': {
    code: 'RO',
    name: 'Romania',
    currency: 'RON',
    currencySymbol: 'lei',
    language: 'ro',
    region: 'Europe',
    googleDomain: 'google.ro',
    timezone: 'Europe/Bucharest',
    phoneCode: '+40',
    popular: false
  },
  'BG': {
    code: 'BG',
    name: 'Bulgaria',
    currency: 'BGN',
    currencySymbol: 'лв',
    language: 'bg',
    region: 'Europe',
    googleDomain: 'google.bg',
    timezone: 'Europe/Sofia',
    phoneCode: '+359',
    popular: false
  },
  'GR': {
    code: 'GR',
    name: 'Greece',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'el',
    region: 'Europe',
    googleDomain: 'google.gr',
    timezone: 'Europe/Athens',
    phoneCode: '+30',
    popular: false
  },
  'PT': {
    code: 'PT',
    name: 'Portugal',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'pt',
    region: 'Europe',
    googleDomain: 'google.pt',
    timezone: 'Europe/Lisbon',
    phoneCode: '+351',
    popular: true
  },
  'IE': {
    code: 'IE',
    name: 'Ireland',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'en',
    region: 'Europe',
    googleDomain: 'google.ie',
    timezone: 'Europe/Dublin',
    phoneCode: '+353',
    popular: true
  },
  'RU': {
    code: 'RU',
    name: 'Russia',
    currency: 'RUB',
    currencySymbol: '₽',
    language: 'ru',
    region: 'Europe',
    googleDomain: 'google.ru',
    timezone: 'Europe/Moscow',
    phoneCode: '+7',
    popular: true
  },
  'UA': {
    code: 'UA',
    name: 'Ukraine',
    currency: 'UAH',
    currencySymbol: '₴',
    language: 'uk',
    region: 'Europe',
    googleDomain: 'google.com.ua',
    timezone: 'Europe/Kiev',
    phoneCode: '+380',
    popular: false
  },

  // Asia
  'CN': {
    code: 'CN',
    name: 'China',
    currency: 'CNY',
    currencySymbol: '¥',
    language: 'zh',
    region: 'Asia',
    googleDomain: 'google.cn',
    timezone: 'Asia/Shanghai',
    phoneCode: '+86',
    popular: true
  },
  'JP': {
    code: 'JP',
    name: 'Japan',
    currency: 'JPY',
    currencySymbol: '¥',
    language: 'ja',
    region: 'Asia',
    googleDomain: 'google.co.jp',
    timezone: 'Asia/Tokyo',
    phoneCode: '+81',
    popular: true
  },
  'KR': {
    code: 'KR',
    name: 'South Korea',
    currency: 'KRW',
    currencySymbol: '₩',
    language: 'ko',
    region: 'Asia',
    googleDomain: 'google.co.kr',
    timezone: 'Asia/Seoul',
    phoneCode: '+82',
    popular: true
  },
  'IN': {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    currencySymbol: '₹',
    language: 'hi',
    region: 'Asia',
    googleDomain: 'google.co.in',
    timezone: 'Asia/Kolkata',
    phoneCode: '+91',
    popular: true
  },
  'SG': {
    code: 'SG',
    name: 'Singapore',
    currency: 'SGD',
    currencySymbol: 'S$',
    language: 'en',
    region: 'Asia',
    googleDomain: 'google.com.sg',
    timezone: 'Asia/Singapore',
    phoneCode: '+65',
    popular: true
  },
  'HK': {
    code: 'HK',
    name: 'Hong Kong',
    currency: 'HKD',
    currencySymbol: 'HK$',
    language: 'zh',
    region: 'Asia',
    googleDomain: 'google.com.hk',
    timezone: 'Asia/Hong_Kong',
    phoneCode: '+852',
    popular: true
  },
  'TW': {
    code: 'TW',
    name: 'Taiwan',
    currency: 'TWD',
    currencySymbol: 'NT$',
    language: 'zh',
    region: 'Asia',
    googleDomain: 'google.com.tw',
    timezone: 'Asia/Taipei',
    phoneCode: '+886',
    popular: true
  },
  'MY': {
    code: 'MY',
    name: 'Malaysia',
    currency: 'MYR',
    currencySymbol: 'RM',
    language: 'ms',
    region: 'Asia',
    googleDomain: 'google.com.my',
    timezone: 'Asia/Kuala_Lumpur',
    phoneCode: '+60',
    popular: true
  },
  'TH': {
    code: 'TH',
    name: 'Thailand',
    currency: 'THB',
    currencySymbol: '฿',
    language: 'th',
    region: 'Asia',
    googleDomain: 'google.co.th',
    timezone: 'Asia/Bangkok',
    phoneCode: '+66',
    popular: true
  },
  'VN': {
    code: 'VN',
    name: 'Vietnam',
    currency: 'VND',
    currencySymbol: '₫',
    language: 'vi',
    region: 'Asia',
    googleDomain: 'google.com.vn',
    timezone: 'Asia/Ho_Chi_Minh',
    phoneCode: '+84',
    popular: true
  },
  'ID': {
    code: 'ID',
    name: 'Indonesia',
    currency: 'IDR',
    currencySymbol: 'Rp',
    language: 'id',
    region: 'Asia',
    googleDomain: 'google.co.id',
    timezone: 'Asia/Jakarta',
    phoneCode: '+62',
    popular: true
  },
  'PH': {
    code: 'PH',
    name: 'Philippines',
    currency: 'PHP',
    currencySymbol: '₱',
    language: 'en',
    region: 'Asia',
    googleDomain: 'google.com.ph',
    timezone: 'Asia/Manila',
    phoneCode: '+63',
    popular: true
  },
  'BD': {
    code: 'BD',
    name: 'Bangladesh',
    currency: 'BDT',
    currencySymbol: '৳',
    language: 'bn',
    region: 'Asia',
    googleDomain: 'google.com.bd',
    timezone: 'Asia/Dhaka',
    phoneCode: '+880',
    popular: false
  },
  'PK': {
    code: 'PK',
    name: 'Pakistan',
    currency: 'PKR',
    currencySymbol: '₨',
    language: 'ur',
    region: 'Asia',
    googleDomain: 'google.com.pk',
    timezone: 'Asia/Karachi',
    phoneCode: '+92',
    popular: false
  },
  'LK': {
    code: 'LK',
    name: 'Sri Lanka',
    currency: 'LKR',
    currencySymbol: '₨',
    language: 'si',
    region: 'Asia',
    googleDomain: 'google.lk',
    timezone: 'Asia/Colombo',
    phoneCode: '+94',
    popular: false
  },

  // Middle East
  'AE': {
    code: 'AE',
    name: 'United Arab Emirates',
    currency: 'AED',
    currencySymbol: 'د.إ',
    language: 'ar',
    region: 'Middle East',
    googleDomain: 'google.ae',
    timezone: 'Asia/Dubai',
    phoneCode: '+971',
    popular: true
  },
  'SA': {
    code: 'SA',
    name: 'Saudi Arabia',
    currency: 'SAR',
    currencySymbol: '﷼',
    language: 'ar',
    region: 'Middle East',
    googleDomain: 'google.com.sa',
    timezone: 'Asia/Riyadh',
    phoneCode: '+966',
    popular: true
  },
  'QA': {
    code: 'QA',
    name: 'Qatar',
    currency: 'QAR',
    currencySymbol: '﷼',
    language: 'ar',
    region: 'Middle East',
    googleDomain: 'google.com.qa',
    timezone: 'Asia/Qatar',
    phoneCode: '+974',
    popular: true
  },
  'KW': {
    code: 'KW',
    name: 'Kuwait',
    currency: 'KWD',
    currencySymbol: 'د.ك',
    language: 'ar',
    region: 'Middle East',
    googleDomain: 'google.com.kw',
    timezone: 'Asia/Kuwait',
    phoneCode: '+965',
    popular: true
  },
  'BH': {
    code: 'BH',
    name: 'Bahrain',
    currency: 'BHD',
    currencySymbol: '.د.ب',
    language: 'ar',
    region: 'Middle East',
    googleDomain: 'google.com.bh',
    timezone: 'Asia/Bahrain',
    phoneCode: '+973',
    popular: false
  },
  'OM': {
    code: 'OM',
    name: 'Oman',
    currency: 'OMR',
    currencySymbol: '﷼',
    language: 'ar',
    region: 'Middle East',
    googleDomain: 'google.com.om',
    timezone: 'Asia/Muscat',
    phoneCode: '+968',
    popular: false
  },
  'IL': {
    code: 'IL',
    name: 'Israel',
    currency: 'ILS',
    currencySymbol: '₪',
    language: 'he',
    region: 'Middle East',
    googleDomain: 'google.co.il',
    timezone: 'Asia/Jerusalem',
    phoneCode: '+972',
    popular: true
  },
  'TR': {
    code: 'TR',
    name: 'Turkey',
    currency: 'TRY',
    currencySymbol: '₺',
    language: 'tr',
    region: 'Middle East',
    googleDomain: 'google.com.tr',
    timezone: 'Europe/Istanbul',
    phoneCode: '+90',
    popular: true
  },
  'IR': {
    code: 'IR',
    name: 'Iran',
    currency: 'IRR',
    currencySymbol: '﷼',
    language: 'fa',
    region: 'Middle East',
    googleDomain: 'google.com',
    timezone: 'Asia/Tehran',
    phoneCode: '+98',
    popular: false
  },

  // Africa
  'ZA': {
    code: 'ZA',
    name: 'South Africa',
    currency: 'ZAR',
    currencySymbol: 'R',
    language: 'en',
    region: 'Africa',
    googleDomain: 'google.co.za',
    timezone: 'Africa/Johannesburg',
    phoneCode: '+27',
    popular: true
  },
  'EG': {
    code: 'EG',
    name: 'Egypt',
    currency: 'EGP',
    currencySymbol: '£',
    language: 'ar',
    region: 'Africa',
    googleDomain: 'google.com.eg',
    timezone: 'Africa/Cairo',
    phoneCode: '+20',
    popular: true
  },
  'NG': {
    code: 'NG',
    name: 'Nigeria',
    currency: 'NGN',
    currencySymbol: '₦',
    language: 'en',
    region: 'Africa',
    googleDomain: 'google.com.ng',
    timezone: 'Africa/Lagos',
    phoneCode: '+234',
    popular: true
  },
  'KE': {
    code: 'KE',
    name: 'Kenya',
    currency: 'KES',
    currencySymbol: 'KSh',
    language: 'en',
    region: 'Africa',
    googleDomain: 'google.co.ke',
    timezone: 'Africa/Nairobi',
    phoneCode: '+254',
    popular: false
  },
  'MA': {
    code: 'MA',
    name: 'Morocco',
    currency: 'MAD',
    currencySymbol: 'د.م.',
    language: 'ar',
    region: 'Africa',
    googleDomain: 'google.co.ma',
    timezone: 'Africa/Casablanca',
    phoneCode: '+212',
    popular: false
  },
  'TN': {
    code: 'TN',
    name: 'Tunisia',
    currency: 'TND',
    currencySymbol: 'د.ت',
    language: 'ar',
    region: 'Africa',
    googleDomain: 'google.tn',
    timezone: 'Africa/Tunis',
    phoneCode: '+216',
    popular: false
  },
  'GH': {
    code: 'GH',
    name: 'Ghana',
    currency: 'GHS',
    currencySymbol: '₵',
    language: 'en',
    region: 'Africa',
    googleDomain: 'google.com.gh',
    timezone: 'Africa/Accra',
    phoneCode: '+233',
    popular: false
  },
  'ET': {
    code: 'ET',
    name: 'Ethiopia',
    currency: 'ETB',
    currencySymbol: 'Br',
    language: 'am',
    region: 'Africa',
    googleDomain: 'google.com.et',
    timezone: 'Africa/Addis_Ababa',
    phoneCode: '+251',
    popular: false
  },

  // Oceania
  'AU': {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    currencySymbol: 'A$',
    language: 'en',
    region: 'Oceania',
    googleDomain: 'google.com.au',
    timezone: 'Australia/Sydney',
    phoneCode: '+61',
    popular: true
  },
  'NZ': {
    code: 'NZ',
    name: 'New Zealand',
    currency: 'NZD',
    currencySymbol: 'NZ$',
    language: 'en',
    region: 'Oceania',
    googleDomain: 'google.co.nz',
    timezone: 'Pacific/Auckland',
    phoneCode: '+64',
    popular: true
  },
  'FJ': {
    code: 'FJ',
    name: 'Fiji',
    currency: 'FJD',
    currencySymbol: 'FJ$',
    language: 'en',
    region: 'Oceania',
    googleDomain: 'google.com.fj',
    timezone: 'Pacific/Fiji',
    phoneCode: '+679',
    popular: false
  },

  // Additional countries (continuing the comprehensive list)
  'JM': {
    code: 'JM',
    name: 'Jamaica',
    currency: 'JMD',
    currencySymbol: 'J$',
    language: 'en',
    region: 'Caribbean',
    googleDomain: 'google.com.jm',
    timezone: 'America/Jamaica',
    phoneCode: '+1876',
    popular: false
  },
  'TT': {
    code: 'TT',
    name: 'Trinidad and Tobago',
    currency: 'TTD',
    currencySymbol: 'TT$',
    language: 'en',
    region: 'Caribbean',
    googleDomain: 'google.tt',
    timezone: 'America/Port_of_Spain',
    phoneCode: '+1868',
    popular: false
  },
  'CR': {
    code: 'CR',
    name: 'Costa Rica',
    currency: 'CRC',
    currencySymbol: '₡',
    language: 'es',
    region: 'Central America',
    googleDomain: 'google.co.cr',
    timezone: 'America/Costa_Rica',
    phoneCode: '+506',
    popular: false
  },
  'PA': {
    code: 'PA',
    name: 'Panama',
    currency: 'PAB',
    currencySymbol: 'B/.',
    language: 'es',
    region: 'Central America',
    googleDomain: 'google.com.pa',
    timezone: 'America/Panama',
    phoneCode: '+507',
    popular: false
  },
  'GT': {
    code: 'GT',
    name: 'Guatemala',
    currency: 'GTQ',
    currencySymbol: 'Q',
    language: 'es',
    region: 'Central America',
    googleDomain: 'google.com.gt',
    timezone: 'America/Guatemala',
    phoneCode: '+502',
    popular: false
  },
  'IS': {
    code: 'IS',
    name: 'Iceland',
    currency: 'ISK',
    currencySymbol: 'kr',
    language: 'is',
    region: 'Europe',
    googleDomain: 'google.is',
    timezone: 'Atlantic/Reykjavik',
    phoneCode: '+354',
    popular: false
  },
  'LU': {
    code: 'LU',
    name: 'Luxembourg',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'fr',
    region: 'Europe',
    googleDomain: 'google.lu',
    timezone: 'Europe/Luxembourg',
    phoneCode: '+352',
    popular: false
  },
  'MT': {
    code: 'MT',
    name: 'Malta',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'mt',
    region: 'Europe',
    googleDomain: 'google.com.mt',
    timezone: 'Europe/Malta',
    phoneCode: '+356',
    popular: false
  },
  'CY': {
    code: 'CY',
    name: 'Cyprus',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'el',
    region: 'Europe',
    googleDomain: 'google.com.cy',
    timezone: 'Asia/Nicosia',
    phoneCode: '+357',
    popular: false
  },
  'EE': {
    code: 'EE',
    name: 'Estonia',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'et',
    region: 'Europe',
    googleDomain: 'google.ee',
    timezone: 'Europe/Tallinn',
    phoneCode: '+372',
    popular: false
  },
  'LV': {
    code: 'LV',
    name: 'Latvia',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'lv',
    region: 'Europe',
    googleDomain: 'google.lv',
    timezone: 'Europe/Riga',
    phoneCode: '+371',
    popular: false
  },
  'LT': {
    code: 'LT',
    name: 'Lithuania',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'lt',
    region: 'Europe',
    googleDomain: 'google.lt',
    timezone: 'Europe/Vilnius',
    phoneCode: '+370',
    popular: false
  },
  'SI': {
    code: 'SI',
    name: 'Slovenia',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'sl',
    region: 'Europe',
    googleDomain: 'google.si',
    timezone: 'Europe/Ljubljana',
    phoneCode: '+386',
    popular: false
  },
  'SK': {
    code: 'SK',
    name: 'Slovakia',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'sk',
    region: 'Europe',
    googleDomain: 'google.sk',
    timezone: 'Europe/Bratislava',
    phoneCode: '+421',
    popular: false
  },
  'HR': {
    code: 'HR',
    name: 'Croatia',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'hr',
    region: 'Europe',
    googleDomain: 'google.hr',
    timezone: 'Europe/Zagreb',
    phoneCode: '+385',
    popular: false
  },
  'RS': {
    code: 'RS',
    name: 'Serbia',
    currency: 'RSD',
    currencySymbol: 'дин.',
    language: 'sr',
    region: 'Europe',
    googleDomain: 'google.rs',
    timezone: 'Europe/Belgrade',
    phoneCode: '+381',
    popular: false
  },
  'BA': {
    code: 'BA',
    name: 'Bosnia and Herzegovina',
    currency: 'BAM',
    currencySymbol: 'KM',
    language: 'bs',
    region: 'Europe',
    googleDomain: 'google.ba',
    timezone: 'Europe/Sarajevo',
    phoneCode: '+387',
    popular: false
  }
};

// Helper functions for easy access
export const getCountryInfo = (countryCode: string): CountryInfo | undefined => {
  return GLOBAL_COUNTRIES[countryCode.toUpperCase()];
};

export const getAllCountries = (): CountryInfo[] => {
  return Object.values(GLOBAL_COUNTRIES);
};

export const getPopularCountries = (): CountryInfo[] => {
  return Object.values(GLOBAL_COUNTRIES).filter(country => country.popular);
};

export const getCountriesByRegion = (region: string): CountryInfo[] => {
  return Object.values(GLOBAL_COUNTRIES).filter(country => country.region === region);
};

export const getSupportedCountryCodes = (): string[] => {
  return Object.keys(GLOBAL_COUNTRIES);
};

export const getCurrencyByCountry = (countryCode: string): string => {
  const country = getCountryInfo(countryCode);
  return country ? country.currency : 'USD';
};

export const getCurrencySymbolByCountry = (countryCode: string): string => {
  const country = getCountryInfo(countryCode);
  return country ? country.currencySymbol : '$';
};

export const getGoogleDomainByCountry = (countryCode: string): string => {
  const country = getCountryInfo(countryCode);
  return country ? country.googleDomain : 'google.com';
};

export const getRegions = (): string[] => {
  const regions = new Set(Object.values(GLOBAL_COUNTRIES).map(country => country.region));
  return Array.from(regions).sort();
};