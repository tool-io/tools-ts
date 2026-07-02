import { simpleError } from "./simple.js";
const alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
export const bytesToBase64 = (bytes: readonly number[]): string => {
  let output = "";
  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index]!;
    const second = bytes[index + 1];
    const third = bytes[index + 2];
    const value = (first << 16) | ((second ?? 0) << 8) | (third ?? 0);
    output += alphabet[(value >>> 18) & 63]! + alphabet[(value >>> 12) & 63]!;
    output += second === undefined ? "=" : alphabet[(value >>> 6) & 63]!;
    output += third === undefined ? "=" : alphabet[value & 63]!;
  }
  return output;
};
export const base64ToBytes = (value: string, field = "bytes"): number[] => {
  if (
    value.length % 4 !== 0 ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(
      value,
    )
  )
    simpleError(field, "Bytes must use canonical Base64 transport encoding.");
  const bytes: number[] = [];
  for (let index = 0; index < value.length; index += 4) {
    const first = alphabet.indexOf(value[index]!);
    const second = alphabet.indexOf(value[index + 1]!);
    const third =
      value[index + 2] === "=" ? 0 : alphabet.indexOf(value[index + 2]!);
    const fourth =
      value[index + 3] === "=" ? 0 : alphabet.indexOf(value[index + 3]!);
    const packed = (first << 18) | (second << 12) | (third << 6) | fourth;
    bytes.push((packed >>> 16) & 255);
    if (value[index + 2] !== "=") bytes.push((packed >>> 8) & 255);
    if (value[index + 3] !== "=") bytes.push(packed & 255);
  }
  return bytes;
};
export const utf8Encode = (text: string): number[] => {
  const bytes: number[] = [];
  for (const character of text) {
    let point = character.codePointAt(0)!;
    if (point >= 0xd800 && point <= 0xdfff) point = 0xfffd;
    if (point <= 0x7f) bytes.push(point);
    else if (point <= 0x7ff)
      bytes.push(0xc0 | (point >>> 6), 0x80 | (point & 63));
    else if (point <= 0xffff)
      bytes.push(
        0xe0 | (point >>> 12),
        0x80 | ((point >>> 6) & 63),
        0x80 | (point & 63),
      );
    else
      bytes.push(
        0xf0 | (point >>> 18),
        0x80 | ((point >>> 12) & 63),
        0x80 | ((point >>> 6) & 63),
        0x80 | (point & 63),
      );
  }
  return bytes;
};
export const utf8Decode = (
  bytes: readonly number[],
  field = "bytes",
): string => {
  let output = "";
  for (let index = 0; index < bytes.length;) {
    const first = bytes[index++]!;
    let point: number;
    let remaining: number;
    if (first <= 0x7f) {
      point = first;
      remaining = 0;
    } else if (first >= 0xc2 && first <= 0xdf) {
      point = first & 31;
      remaining = 1;
    } else if (first >= 0xe0 && first <= 0xef) {
      point = first & 15;
      remaining = 2;
    } else if (first >= 0xf0 && first <= 0xf4) {
      point = first & 7;
      remaining = 3;
    } else return simpleError(field, "Bytes are not valid UTF-8.");
    for (let offset = 0; offset < remaining; offset += 1) {
      const continuation = bytes[index++];
      if (
        continuation === undefined ||
        continuation < 0x80 ||
        continuation > 0xbf
      )
        return simpleError(field, "Bytes are not valid UTF-8.");
      point = (point << 6) | (continuation & 63);
    }
    if (
      (remaining === 1 && point < 0x80) ||
      (remaining === 2 && point < 0x800) ||
      (remaining === 3 && point < 0x10000) ||
      point > 0x10ffff ||
      (point >= 0xd800 && point <= 0xdfff)
    )
      return simpleError(field, "Bytes are not valid UTF-8.");
    output += String.fromCodePoint(point);
  }
  return output;
};
