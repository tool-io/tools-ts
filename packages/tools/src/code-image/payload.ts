export type WifiAuthentication = "WEP" | "WPA" | "nopass";

const escapeQrField = (value: string): string =>
  value.replace(/([\\;,:"])/gu, "\\$1");

const escapeVCardText = (value: string): string =>
  value
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,");

const requireText = (value: string, label: string): string => {
  const normalized = value.trim();
  if (!normalized)
    throw new CodeImageError("payload_field_required", `${label} is required.`);
  return normalized;
};

const queryString = (
  entries: readonly (readonly [string, string | undefined])[],
): string =>
  entries
    .filter(
      (entry): entry is readonly [string, string] => entry[1] !== undefined,
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");

import { CodeImageError } from "./generate.js";

export const buildUrlQrPayload = (url: string): string => {
  const normalized = requireText(url, "URL");
  if (!/^[a-z][a-z0-9+.-]*:\/\//iu.test(normalized))
    throw new CodeImageError(
      "invalid_url",
      "URL must include a scheme such as https://.",
    );
  return normalized;
};

export const buildWifiQrPayload = (input: {
  readonly authentication: WifiAuthentication;
  readonly hidden?: boolean;
  readonly password?: string;
  readonly ssid: string;
}): string => {
  const ssid = requireText(input.ssid, "Network name");
  if (!(["WEP", "WPA", "nopass"] as const).includes(input.authentication))
    throw new CodeImageError(
      "invalid_wifi_authentication",
      "Wi-Fi authentication is invalid.",
    );
  if (input.authentication !== "nopass" && !input.password)
    throw new CodeImageError(
      "payload_field_required",
      "A password is required for a protected Wi-Fi network.",
    );
  return `WIFI:T:${input.authentication};S:${escapeQrField(ssid)};${
    input.authentication === "nopass"
      ? ""
      : `P:${escapeQrField(input.password ?? "")};`
  }H:${input.hidden === true ? "true" : "false"};;`;
};

export const buildContactQrPayload = (input: {
  readonly email?: string;
  readonly name: string;
  readonly organization?: string;
  readonly phone?: string;
  readonly url?: string;
}): string => {
  const name = requireText(input.name, "Name");
  return [
    "BEGIN:VCARD",
    "VERSION:4.0",
    `FN:${escapeVCardText(name)}`,
    ...(input.organization
      ? [`ORG:${escapeVCardText(input.organization)}`]
      : []),
    ...(input.phone ? [`TEL:${escapeVCardText(input.phone)}`] : []),
    ...(input.email ? [`EMAIL:${escapeVCardText(input.email)}`] : []),
    ...(input.url ? [`URL:${escapeVCardText(input.url)}`] : []),
    "END:VCARD",
  ].join("\r\n");
};

export const buildEmailQrPayload = (input: {
  readonly address: string;
  readonly body?: string;
  readonly subject?: string;
}): string => {
  const address = requireText(input.address, "Email address");
  const suffix = queryString([
    ["subject", input.subject],
    ["body", input.body],
  ]);
  return `mailto:${address}${suffix ? `?${suffix}` : ""}`;
};

export const buildSmsQrPayload = (input: {
  readonly message?: string;
  readonly number: string;
}): string => {
  const number = requireText(input.number, "Phone number");
  return `sms:${number}${input.message ? `?body=${encodeURIComponent(input.message)}` : ""}`;
};

export const buildPhoneQrPayload = (number: string): string =>
  `tel:${requireText(number, "Phone number")}`;

export const buildLocationQrPayload = (input: {
  readonly label?: string;
  readonly latitude: number;
  readonly longitude: number;
}): string => {
  if (
    !Number.isFinite(input.latitude) ||
    input.latitude < -90 ||
    input.latitude > 90
  )
    throw new CodeImageError(
      "invalid_coordinate",
      "Latitude must be between -90 and 90.",
    );
  if (
    !Number.isFinite(input.longitude) ||
    input.longitude < -180 ||
    input.longitude > 180
  )
    throw new CodeImageError(
      "invalid_coordinate",
      "Longitude must be between -180 and 180.",
    );
  return `geo:${input.latitude},${input.longitude}${
    input.label
      ? `?q=${input.latitude},${input.longitude}(${encodeURIComponent(input.label)})`
      : ""
  }`;
};

const calendarDate = (value: string): string =>
  value.replace(/[-:]/gu, "").replace(/\.\d{3}/u, "");

export const buildCalendarQrPayload = (input: {
  readonly description?: string;
  readonly end: string;
  readonly location?: string;
  readonly start: string;
  readonly title: string;
}): string =>
  [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${escapeVCardText(requireText(input.title, "Title"))}`,
    `DTSTART:${calendarDate(requireText(input.start, "Start"))}`,
    `DTEND:${calendarDate(requireText(input.end, "End"))}`,
    ...(input.location ? [`LOCATION:${escapeVCardText(input.location)}`] : []),
    ...(input.description
      ? [`DESCRIPTION:${escapeVCardText(input.description)}`]
      : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

export const buildOtpQrPayload = (input: {
  readonly account: string;
  readonly digits?: 6 | 8;
  readonly issuer?: string;
  readonly period?: number;
  readonly secret: string;
}): string => {
  const account = requireText(input.account, "Account");
  const secret = requireText(input.secret, "Secret")
    .replaceAll(" ", "")
    .toLocaleUpperCase("en-US");
  if (!/^[A-Z2-7]+=*$/u.test(secret))
    throw new CodeImageError(
      "invalid_otp_secret",
      "The OTP secret must use Base32.",
    );
  const digits = input.digits ?? 6;
  if (digits !== 6 && digits !== 8)
    throw new CodeImageError(
      "invalid_otp_digits",
      "OTP digits must be 6 or 8.",
    );
  const period = input.period ?? 30;
  if (!Number.isSafeInteger(period) || period < 1 || period > 300)
    throw new CodeImageError(
      "invalid_otp_period",
      "OTP period must be an integer from 1 through 300 seconds.",
    );
  const issuer = input.issuer?.trim();
  const query = queryString([
    ["secret", secret],
    ["issuer", issuer],
    ["digits", String(digits)],
    ["period", String(period)],
  ]);
  const label = issuer ? `${issuer}:${account}` : account;
  return `otpauth://totp/${encodeURIComponent(label)}?${query}`;
};
