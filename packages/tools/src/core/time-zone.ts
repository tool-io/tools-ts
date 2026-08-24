import { simpleError } from "./simple.js";

export type TimeFormat = "12-hour" | "24-hour";
export type LocalTimeDisambiguation = "earlier" | "later" | "reject";

export type TimeZoneReference = {
  readonly canonicalName: string;
  readonly fixedOffsetMinutes?: number;
};

type LocalDateTimeParts = {
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
  readonly month: number;
  readonly second: number;
  readonly year: number;
};

const fixedZoneAliases = new Map<string, number>([
  ["UTC", 0],
  ["GMT", 0],
  ["PST", -8 * 60],
  ["PDT", -7 * 60],
  ["MST", -7 * 60],
  ["MDT", -6 * 60],
  ["CST", -6 * 60],
  ["CDT", -5 * 60],
  ["EST", -5 * 60],
  ["EDT", -4 * 60],
  ["CET", 60],
  ["CEST", 2 * 60],
  ["IST", 5 * 60 + 30],
  ["JST", 9 * 60],
  ["AEST", 10 * 60],
  ["AEDT", 11 * 60],
]);

const ianaZoneAliases = new Map<string, string>([
  ["PT", "America/Los_Angeles"],
  ["PACIFIC TIME", "America/Los_Angeles"],
  ["LOS ANGELES", "America/Los_Angeles"],
  ["MT", "America/Denver"],
  ["MOUNTAIN TIME", "America/Denver"],
  ["DENVER", "America/Denver"],
  ["CT", "America/Chicago"],
  ["CENTRAL TIME", "America/Chicago"],
  ["CHICAGO", "America/Chicago"],
  ["ET", "America/New_York"],
  ["EASTERN TIME", "America/New_York"],
  ["NEW YORK", "America/New_York"],
  ["BERLIN", "Europe/Berlin"],
  ["LONDON", "Europe/London"],
  ["TOKYO", "Asia/Tokyo"],
  ["SYDNEY", "Australia/Sydney"],
  ["SINGAPORE", "Asia/Singapore"],
]);

const pad = (value: number): string => String(value).padStart(2, "0");

const offsetName = (offsetMinutes: number): string => {
  const sign = offsetMinutes < 0 ? "-" : "+";
  const absolute = Math.abs(offsetMinutes);
  return `UTC${sign}${pad(Math.floor(absolute / 60))}:${pad(absolute % 60)}`;
};

const parseOffset = (value: string): number | undefined => {
  const match = /^(?:UTC|GMT)?([+-])(\d{1,2})(?::?(\d{2}))?$/iu.exec(value);
  if (!match) return undefined;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? "0");
  if (hours > 14 || minutes > 59 || (hours === 14 && minutes !== 0))
    return undefined;
  const magnitude = hours * 60 + minutes;
  return match[1] === "-" ? -magnitude : magnitude;
};

export const resolveTimeZone = (
  value: string,
  field = "timeZone",
): TimeZoneReference => {
  const entered = value.trim();
  if (entered.length === 0)
    return simpleError(field, "Enter a time zone.", "invalid_time_zone");
  const upper = entered.toUpperCase();
  const fixedOffset = fixedZoneAliases.get(upper) ?? parseOffset(upper);
  if (fixedOffset !== undefined)
    return {
      canonicalName:
        fixedZoneAliases.has(upper) && upper !== "GMT"
          ? upper
          : offsetName(fixedOffset),
      fixedOffsetMinutes: fixedOffset,
    };
  const candidate = ianaZoneAliases.get(upper) ?? entered;
  try {
    const canonicalName = new Intl.DateTimeFormat("en-US", {
      timeZone: candidate,
    }).resolvedOptions().timeZone;
    return { canonicalName };
  } catch {
    return simpleError(
      field,
      "Use an IANA time zone, a supported city, an abbreviation such as PST, or a UTC offset.",
      "invalid_time_zone",
    );
  }
};

export const availableTimeZones = (): readonly string[] =>
  ["UTC", ...Intl.supportedValuesOf("timeZone")].filter(
    (zone, index, zones) => zones.indexOf(zone) === index,
  );

const parseLocalDateTime = (
  value: string,
  field: string,
): LocalDateTimeParts => {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})[T ](\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/iu.exec(
      value.trim(),
    );
  if (!match)
    return simpleError(
      field,
      "Enter a local date and time such as 2026-01-15 6:00 PM.",
      "invalid_local_date_time",
    );
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  let hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6] ?? "0");
  const dayPeriod = match[7]?.toUpperCase();
  if (dayPeriod) {
    if (hour < 1 || hour > 12)
      return simpleError(
        field,
        "Hours with AM or PM must be between 1 and 12.",
        "invalid_local_date_time",
      );
    hour = (hour % 12) + (dayPeriod === "PM" ? 12 : 0);
  }
  if ((!dayPeriod && hour > 23) || minute > 59 || second > 59)
    return simpleError(
      field,
      "Enter a valid clock time.",
      "invalid_local_date_time",
    );
  const timestamp = Date.UTC(year, month - 1, day, hour, minute, second);
  const parsed = new Date(timestamp);
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  )
    return simpleError(
      field,
      "Enter a valid calendar date.",
      "invalid_local_date_time",
    );
  return { day, hour, minute, month, second, year };
};

const localTimestamp = (parts: LocalDateTimeParts): number =>
  Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

const partsAt = (timestamp: number, timeZone: string): LocalDateTimeParts => {
  const entries = new Intl.DateTimeFormat("en-US", {
    calendar: "iso8601",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    month: "2-digit",
    numberingSystem: "latn",
    second: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(new Date(timestamp));
  const part = (type: Intl.DateTimeFormatPartTypes): number =>
    Number(entries.find((entry) => entry.type === type)?.value ?? "NaN");
  return {
    day: part("day"),
    hour: part("hour"),
    minute: part("minute"),
    month: part("month"),
    second: part("second"),
    year: part("year"),
  };
};

const equalParts = (
  left: LocalDateTimeParts,
  right: LocalDateTimeParts,
): boolean =>
  left.year === right.year &&
  left.month === right.month &&
  left.day === right.day &&
  left.hour === right.hour &&
  left.minute === right.minute &&
  left.second === right.second;

export const offsetMinutesAt = (
  timestamp: number,
  timeZone: TimeZoneReference,
): number =>
  timeZone.fixedOffsetMinutes ??
  (localTimestamp(partsAt(timestamp, timeZone.canonicalName)) - timestamp) /
    60_000;

export const localDateTimeToInstant = (
  value: string,
  timeZone: TimeZoneReference,
  disambiguation: LocalTimeDisambiguation = "earlier",
  field = "localDateTime",
): number => {
  const desired = parseLocalDateTime(value, field);
  const wallTime = localTimestamp(desired);
  if (timeZone.fixedOffsetMinutes !== undefined)
    return wallTime - timeZone.fixedOffsetMinutes * 60_000;

  const offsets = new Set<number>();
  for (const hourDelta of [-36, -24, -12, 0, 12, 24, 36])
    offsets.add(offsetMinutesAt(wallTime + hourDelta * 3_600_000, timeZone));
  const candidates = [...offsets]
    .map((offset) => wallTime - offset * 60_000)
    .filter((candidate) =>
      equalParts(partsAt(candidate, timeZone.canonicalName), desired),
    )
    .sort((left, right) => left - right);
  if (candidates.length === 0)
    return simpleError(
      field,
      "That local time does not exist because the clock moves forward in the selected zone.",
      "nonexistent_local_time",
    );
  if (candidates.length > 1 && disambiguation === "reject")
    return simpleError(
      field,
      "That local time occurs twice because the clock moves backward; choose earlier or later.",
      "ambiguous_local_time",
    );
  return disambiguation === "later"
    ? candidates[candidates.length - 1]
    : candidates[0];
};

export const formatInstantInTimeZone = (
  timestamp: number,
  timeZone: TimeZoneReference,
  format: TimeFormat,
): string => {
  const parts =
    timeZone.fixedOffsetMinutes === undefined
      ? partsAt(timestamp, timeZone.canonicalName)
      : (() => {
          const shifted = new Date(
            timestamp + timeZone.fixedOffsetMinutes * 60_000,
          );
          return {
            day: shifted.getUTCDate(),
            hour: shifted.getUTCHours(),
            minute: shifted.getUTCMinutes(),
            month: shifted.getUTCMonth() + 1,
            second: shifted.getUTCSeconds(),
            year: shifted.getUTCFullYear(),
          };
        })();
  const date = `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
  const clock =
    format === "24-hour"
      ? `${pad(parts.hour)}:${pad(parts.minute)}:${pad(parts.second)}`
      : `${pad(parts.hour % 12 || 12)}:${pad(parts.minute)}:${pad(parts.second)} ${
          parts.hour < 12 ? "AM" : "PM"
        }`;
  return `${date} ${clock} (${offsetName(offsetMinutesAt(timestamp, timeZone))})`;
};
