import { PatientPharmacy } from '../bean/constants';
import { ImfDefinition, Product } from '../bean/models/product';
import { Month } from '../bean/simple.types';

export const observationSpans = (observastions?: string[]): string => {
  let spans = '';
  if (observastions) {
    observastions.forEach(o => spans += `<span>${o}</span>`);
  }
  return spans;
};

export const getAge = (date: Date) => {
  const today = new Date();
  const years = today.getFullYear() - date.getFullYear();
  const month = today.getMonth() - date.getMonth();
  if (month !== 0) {
    return (month > 0) ? years : years - 1;
  } else {
    const day = today.getDay() - date.getDay();
    return (day >= 0) ? years : years - 1;
  }
};

export const getMonth = (m?: number) => {
  if (m === undefined) m = new Date().getMonth();
  switch (m) {
    case 0:
      return 'month.january';
    case 1:
      return 'month.february';
    case 2:
      return 'month.march';
    case 3:
      return 'month.april';
    case 4:
      return 'month.may';
    case 5:
      return 'month.june';
    case 6:
      return 'month.july';
    case 7:
      return 'month.august';
    case 8:
      return 'month.september';
    case 9:
      return 'month.october';
    case 10:
      return 'month.november';
    default:
      return 'month.december';
  }
};



export const isBlank = (elem: string | undefined | null): boolean => {
  if (!elem) return true;
  if (elem && elem.length === 0) return true;
  return false;
};

export const getMonths = (): Month[] => {
  const months: Month[] = [];
  for (let i = 0; i < 12; i++) {
    months.push({ code: i, description: getMonth(i) });
  }
  return months;
};

export const randomNumber = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const randomText = (max = 10): string => {
  const abc = 'abcdefghijklmnopqrstuvwxyz';
  const length = Math.floor(Math.random() * max) + 1;
  let result = '';

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * abc.length);
    const char = abc[index];
    result += char;
  }

  return result;
};

export const pvpError = (product: Product): boolean => {
  const pvpTax = product.pvp.valueTax;
  const units = product.units.value;
  const pvp = product.pvp.value;
  const imf = product.imf;
  const aport = product.userConsideration.aportation;
  const improvable = product.improvable;

  //Sin unidades
  if (units === 0) return false;

  //No hay pvp
  if (!pvpTax || !pvp) return true;

  //PVP menor que la aportación
  if (aport && pvpTax < aport) return true;

  //Producto no mejorable
  if (improvable && imf.maxImf) {
    return (pvp) > to2DecimalsNumber(imf.maxImf / 1.1);
  }

  // No hay imf definido
  if (imf.imfNoTax === undefined) return false;
  else return (pvp) > imf.imfNoTax;
};

export const aportationCalculation = (product: Product, reimbursement: boolean, iva: number, pharmacyIndicator?: string): number => {
  const units = product.units.value;
  if (reimbursement) {
    const pvp = product.pvp?.value || 0;
    return units * pvp * iva;
  } else {
    if (pharmacyIndicator === PatientPharmacy) {
      return 0;
    } else {
      return units * (product.userConsideration.aportation || 0);
    }
  }
};

export const formatDateNoHour = (date: string | Date): string => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
};

export const mapSanitaryCardToCipaBySeparator = (card: string): string | undefined => {
  if (card[0] === '%' && card.length <= 79) {
    const fields = card.split('^');
    const cipAut = fields.at(0)?.substring(1).trim(); // cip-aut without %
    const cipSns = fields.at(1)?.trim();
    const code = fields.at(2)?.trim();
    const fullNameCoded = fields.at(3)?.split('?').at(0)?.trim();
    const fullName = mapCardFullName(fullNameCoded);
    const lcr = fields.at(3)?.split('?').at(1);
    if (cipAut) return cipAut;
  }
  return undefined;
};

export const mapSanitaryCardToCipaByPosition = (card: string): string | undefined => {
  if (card[0] === '%' && card.length <= 79) {
    const cipAut = card.substring(1, 16).trim();
    const cipSns = card.substring(1, 16).trim();
    const code = card.substring(1, 16).trim();
    const fullNameCoded = card.substring(1, 16).trim();
    const fullName = mapCardFullName(fullNameCoded);
    const lcr = card.substring(1, 16).trim();
    if (cipAut) return cipAut;
  }
  return undefined;
};

const mapCardFullName = (fullcodedName?: string): string => {
  if (fullcodedName && fullcodedName.includes('//')) {
    const fullNameList = fullcodedName.split('//');
    return fullNameList.at(0) + ' ' + fullNameList.at(1);
  } else if (fullcodedName && fullcodedName.split('/').length === 3) {
    const fullNameList = fullcodedName.split('/');
    return fullNameList.at(2) + ' ' + fullNameList.at(0) + ' ' + fullNameList.at(1);
  }
  return fullcodedName || '';
};

export const to2DecimalsNumber = (num: number): number => {
  return Number((Math.round(num * 100) / 100).toFixed(2));
};

export const adjustNumericValue = (valor: string | number): number => {
  if (typeof valor === 'string') {
    return +valor.replace(/,|\./g, '.');
  }
  return +valor;
};

