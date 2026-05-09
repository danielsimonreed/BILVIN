export const BILVIN_TIME_ZONE = 'Asia/Jakarta';
export const RELATIONSHIP_START_DATE_ISO = '2025-09-09T00:00:00+07:00';
export const RELATIONSHIP_START_DATE = new Date(RELATIONSHIP_START_DATE_ISO);

export type AnniversaryTier = 'none' | 'monthly' | 'yearly';

export interface AnniversaryState {
  isAnniversaryDay: boolean;
  isYearlyAnniversary: boolean;
  monthCount: number;
  yearCount: number;
  anniversaryTier: AnniversaryTier;
  title: string;
  badgeLabel: string;
  accentLabel: string;
  sessionKey: string;
}

interface ZonedDateParts {
  year: number;
  month: number;
  day: number;
}

const zonedDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: BILVIN_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const getZonedDateParts = (date: Date): ZonedDateParts => {
  const parts = zonedDateFormatter.formatToParts(date);
  const getValue = (type: 'year' | 'month' | 'day') => {
    const value = parts.find((part) => part.type === type)?.value;
    return Number(value);
  };

  return {
    year: getValue('year'),
    month: getValue('month'),
    day: getValue('day'),
  };
};

export const getMonthsSinceStart = (date: Date): number => {
  if (date.getTime() < RELATIONSHIP_START_DATE.getTime()) {
    return 0;
  }

  const start = getZonedDateParts(RELATIONSHIP_START_DATE);
  const current = getZonedDateParts(date);

  let months =
    (current.year - start.year) * 12 + (current.month - start.month);

  if (current.day < start.day) {
    months -= 1;
  }

  return Math.max(0, months);
};

export const getAnniversaryLabel = (monthCount: number): string => {
  if (monthCount > 0 && monthCount % 12 === 0) {
    const yearCount = monthCount / 12;
    return yearCount === 1
      ? 'One year of Bilvin'
      : `${yearCount} years of Bilvin`;
  }

  return `${monthCount} months of Bilvin`;
};

export const getAnniversaryAccentLabel = (monthCount: number): string => {
  if (monthCount > 0 && monthCount % 12 === 0) {
    const yearCount = monthCount / 12;
    return yearCount === 1
      ? 'Satu tahun, dan semuanya masih terasa hangat.'
      : `${yearCount} tahun, tetap kamu yang paling terasa seperti rumah.`;
  }

  return 'Tanggal 9 selalu punya alasan untuk terasa sedikit lebih indah.';
};

export const getAnniversaryState = (date: Date = new Date()): AnniversaryState => {
  const nowParts = getZonedDateParts(date);
  const startParts = getZonedDateParts(RELATIONSHIP_START_DATE);
  const monthCount = getMonthsSinceStart(date);
  const isAnniversaryDay =
    date.getTime() >= RELATIONSHIP_START_DATE.getTime() &&
    nowParts.day === startParts.day &&
    monthCount >= 1;
  const isYearlyAnniversary = isAnniversaryDay && monthCount % 12 === 0;
  const anniversaryTier: AnniversaryTier = !isAnniversaryDay
    ? 'none'
    : isYearlyAnniversary
      ? 'yearly'
      : 'monthly';
  const yearCount = Math.floor(monthCount / 12);
  const title = isAnniversaryDay ? getAnniversaryLabel(monthCount) : 'BILVIN';
  const badgeLabel = isYearlyAnniversary
    ? 'Annual Celebration'
    : isAnniversaryDay
      ? 'Anniversary Day'
      : 'Our Love Story';
  const accentLabel = isAnniversaryDay
    ? getAnniversaryAccentLabel(monthCount)
    : 'Every day is ours.';
  const dateKey = `${nowParts.year}-${String(nowParts.month).padStart(2, '0')}-${String(nowParts.day).padStart(2, '0')}`;

  return {
    isAnniversaryDay,
    isYearlyAnniversary,
    monthCount,
    yearCount,
    anniversaryTier,
    title,
    badgeLabel,
    accentLabel,
    sessionKey: `bilvin-anniversary-${anniversaryTier}-${dateKey}`,
  };
};

export const addMonthsToRelationshipStart = (monthOffset: number): Date => {
  const anniversaryDate = new Date(RELATIONSHIP_START_DATE);
  anniversaryDate.setMonth(anniversaryDate.getMonth() + monthOffset);
  return anniversaryDate;
};
