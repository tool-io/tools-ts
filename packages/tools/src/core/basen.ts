import { simpleError } from "./simple.js";

const greatestCommonDivisor = (a: number, b: number): number =>
  b === 0 ? a : greatestCommonDivisor(b, a % b);

const indexByChar = (alphabet: string): Map<string, number> => {
  const index = new Map<string, number>();
  for (let position = 0; position < alphabet.length; position += 1)
    index.set(alphabet[position]!, position);
  return index;
};

export type BitCodecConfig = {
  readonly alphabet: string;
  readonly bitsPerChar: number;
  readonly padChar?: string;
};

export type BitCodec = {
  readonly decode: (value: string, field?: string) => number[];
  readonly encode: (bytes: readonly number[], field?: string) => string;
};

export const createBitCodec = (config: BitCodecConfig): BitCodec => {
  const { alphabet, bitsPerChar, padChar } = config;
  const mask = (1 << bitsPerChar) - 1;
  const blockChars =
    ((8 * bitsPerChar) / greatestCommonDivisor(8, bitsPerChar)) / bitsPerChar;
  const charIndex = indexByChar(alphabet);
  return {
    decode: (value, field = "value"): number[] => {
      let end = value.length;
      if (padChar !== undefined)
        while (end > 0 && value[end - 1] === padChar) end -= 1;
      const data = value.slice(0, end);
      const padCount = value.length - end;
      if (
        (padChar !== undefined && data.includes(padChar)) ||
        (padCount > 0 && data.length === 0)
      )
        simpleError(field, `${field} must use canonical padding.`, "invalid_padding");
      if (padCount >= blockChars)
        simpleError(
          field,
          `${field} padding must be shorter than one block.`,
          "invalid_length",
        );
      if (padChar !== undefined && value.length % blockChars !== 0)
        simpleError(field, `${field} length must fill complete blocks.`, "invalid_length");
      const bytes: number[] = [];
      let buffer = 0;
      let count = 0;
      for (const character of data) {
        const index = charIndex.get(character);
        if (index === undefined)
          simpleError(
            field,
            `${field} contains a character outside the codec alphabet.`,
            "invalid_character",
          );
        buffer = (buffer << bitsPerChar) | index!;
        count += bitsPerChar;
        if (count >= 8) {
          count -= 8;
          bytes.push((buffer >>> count) & 255);
          buffer &= (1 << count) - 1;
        }
      }
      const leftoverBits = (data.length * bitsPerChar) % 8;
      if (leftoverBits >= bitsPerChar)
        simpleError(
          field,
          `${field} trailing characters do not encode complete bytes.`,
          "invalid_length",
        );
      if (count > 0 && (buffer & ((1 << count) - 1)) !== 0)
        simpleError(
          field,
          `${field} trailing bits are not zero and therefore not canonical.`,
          "non_canonical_bits",
        );
      return bytes;
    },
    encode: (bytes): string => {
      let buffer = 0;
      let count = 0;
      let output = "";
      for (const byte of bytes) {
        buffer = (buffer << 8) | byte;
        count += 8;
        while (count >= bitsPerChar) {
          count -= bitsPerChar;
          output += alphabet[(buffer >>> count) & mask]!;
        }
        buffer &= (1 << count) - 1;
      }
      if (count > 0) output += alphabet[(buffer << (bitsPerChar - count)) & mask]!;
      const padLength = (blockChars - (output.length % blockChars)) % blockChars;
      return padChar === undefined || padLength === 0
        ? output
        : output + padChar.repeat(padLength);
    },
  };
};

export type RadixCodecConfig = {
  readonly alphabet: string;
  readonly leadingZeroChar?: string;
};

export type RadixCodec = {
  readonly decode: (value: string, field?: string) => number[];
  readonly encode: (bytes: readonly number[], field?: string) => string;
};

export const createRadixCodec = (config: RadixCodecConfig): RadixCodec => {
  const { alphabet, leadingZeroChar } = config;
  const base = BigInt(alphabet.length);
  const charIndex = indexByChar(alphabet);
  return {
    decode: (value, field = "value"): number[] => {
      let zeros = 0;
      if (leadingZeroChar !== undefined)
        while (zeros < value.length && value[zeros] === leadingZeroChar) zeros += 1;
      let number = 0n;
      for (const character of value) {
        const index = charIndex.get(character);
        if (index === undefined)
          simpleError(
            field,
            `${field} contains a character outside the codec alphabet.`,
            "invalid_character",
          );
        number = number * base + BigInt(index!);
      }
      const chunks: number[] = [];
      while (number > 0n) {
        chunks.push(Number(number & 255n));
        number >>= 8n;
      }
      chunks.reverse();
      return [...new Array<number>(zeros).fill(0), ...chunks];
    },
    encode: (bytes): string => {
      let zeros = 0;
      while (zeros < bytes.length && bytes[zeros] === 0) zeros += 1;
      let number = 0n;
      for (const byte of bytes) number = (number << 8n) | BigInt(byte);
      if (number === 0n)
        return leadingZeroChar === undefined ? "" : leadingZeroChar.repeat(zeros);
      const digits: string[] = [];
      while (number > 0n) {
        digits.push(alphabet[Number(number % base)]!);
        number /= base;
      }
      const prefix =
        leadingZeroChar === undefined ? "" : leadingZeroChar.repeat(zeros);
      return prefix + digits.reverse().join("");
    },
  };
};

export type BlockCodecConfig = {
  readonly allowPartialFinalGroup?: boolean;
  readonly alphabet: string;
  readonly bytesPerBlock?: number;
  readonly charsPerBlock?: number;
  readonly zeroGroupChar?: string;
};

export type BlockCodec = {
  readonly decode: (value: string, field?: string) => number[];
  readonly encode: (bytes: readonly number[], field?: string) => string;
};

export const createBlockCodec = (config: BlockCodecConfig): BlockCodec => {
  const { alphabet, zeroGroupChar } = config;
  const bytesPerBlock = config.bytesPerBlock ?? 4;
  const charsPerBlock = config.charsPerBlock ?? 5;
  const base = alphabet.length;
  const maxPackedValue = 256 ** bytesPerBlock - 1;
  const charIndex = indexByChar(alphabet);
  const pack = (group: readonly number[]): number => {
    let value = 0;
    for (const byte of group) value = ((value << 8) | byte) >>> 0;
    return value;
  };
  const unpack = (value: number): number[] => {
    const bytes: number[] = [];
    for (let offset = bytesPerBlock - 1; offset >= 0; offset -= 1)
      bytes.push(Math.floor(value / 256 ** offset) % 256);
    return bytes;
  };
  const encodeDigits = (value: number): string[] => {
    const digits: string[] = [];
    for (let exponent = charsPerBlock - 1; exponent >= 0; exponent -= 1)
      digits.push(alphabet[Math.floor(value / base ** exponent) % base]!);
    return digits;
  };
  return {
    decode: (value, field = "value"): number[] => {
      const bytes: number[] = [];
      let group: number[] = [];
      const flush = (digits: readonly number[]): number[] => {
        let packed = 0;
        for (const digit of digits) packed = packed * base + digit;
        if (packed > maxPackedValue)
          simpleError(
            field,
            `${field} contains an encoding group that overflows.`,
            "encoding_overflow",
          );
        return unpack(packed);
      };
      for (const character of value) {
        if (zeroGroupChar !== undefined && character === zeroGroupChar) {
          if (group.length > 0)
            simpleError(
              field,
              `${field} zero group character may only replace a full group.`,
              "invalid_character",
            );
          bytes.push(...new Array<number>(bytesPerBlock).fill(0));
          continue;
        }
        const index = charIndex.get(character);
        if (index === undefined)
          simpleError(
            field,
            `${field} contains a character outside the codec alphabet.`,
            "invalid_character",
          );
        group.push(index!);
        if (group.length === charsPerBlock) {
          bytes.push(...flush(group));
          group = [];
        }
      }
      if (group.length === 0) return bytes;
      if (!config.allowPartialFinalGroup)
        simpleError(
          field,
          `${field} length must be a multiple of ${charsPerBlock}.`,
          "invalid_length",
        );
      if (group.length === 1)
        simpleError(
          field,
          `${field} final group is too short to decode.`,
          "invalid_length",
        );
      const paddingDigit = base - 1;
      const padded = [
        ...group,
        ...new Array<number>(charsPerBlock - group.length).fill(paddingDigit),
      ];
      const decoded = flush(padded);
      const byteCount = Math.floor(
        (group.length * bytesPerBlock) / charsPerBlock,
      );
      return [...bytes, ...decoded.slice(0, byteCount)];
    },
    encode: (bytes, field = "text"): string => {
      const output: string[] = [];
      for (let offset = 0; offset < bytes.length; offset += bytesPerBlock) {
        const group = bytes.slice(offset, offset + bytesPerBlock);
        const partial = group.length !== bytesPerBlock;
        if (partial && !config.allowPartialFinalGroup)
          simpleError(
            field,
            `Value must encode in multiples of ${bytesPerBlock} bytes.`,
            "invalid_length",
          );
        const packed = pack([
          ...group,
          ...new Array<number>(bytesPerBlock - group.length).fill(0),
        ]);
        if (!partial && zeroGroupChar !== undefined && packed === 0) {
          output.push(zeroGroupChar);
          continue;
        }
        const digits = encodeDigits(packed);
        output.push(
          partial
            ? digits
                .slice(0, Math.ceil((group.length * charsPerBlock) / bytesPerBlock))
                .join("")
            : digits.join(""),
        );
      }
      return output.join("");
    },
  };
};

export const base32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export const base32Codec = createBitCodec({
  alphabet: base32Alphabet,
  bitsPerChar: 5,
  padChar: "=",
});

export const base58Alphabet =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export const base58Codec = createRadixCodec({
  alphabet: base58Alphabet,
  leadingZeroChar: "1",
});

export const ascii85Alphabet =
  "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstu";

export const ascii85Codec = createBlockCodec({
  allowPartialFinalGroup: true,
  alphabet: ascii85Alphabet,
  zeroGroupChar: "z",
});

export const z85Alphabet =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#";

export const z85Codec = createBlockCodec({ alphabet: z85Alphabet });

export type Base85Variant = "ascii85" | "z85";

export const base85Variants: readonly Base85Variant[] = ["ascii85", "z85"];

export const isBase85Variant = (value: unknown): value is Base85Variant =>
  value === "ascii85" || value === "z85";

export const resolveBase85Codec = (variant: Base85Variant): BlockCodec =>
  variant === "z85" ? z85Codec : ascii85Codec;

export const base91Alphabet =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~\"";

const base91CharIndex = indexByChar(base91Alphabet);

export type Base91Codec = {
  readonly decode: (value: string, field?: string) => number[];
  readonly encode: (bytes: readonly number[]) => string;
};

export const base91Codec: Base91Codec = {
  decode: (value, field = "value"): number[] => {
    const bytes: number[] = [];
    let buffer = 0;
    let count = 0;
    let pendingDigit = -1;
    for (const character of value) {
      const digit = base91CharIndex.get(character);
      if (digit === undefined)
        simpleError(
          field,
          `${field} contains a character outside the codec alphabet.`,
          "invalid_character",
        );
      if (pendingDigit < 0) {
        pendingDigit = digit!;
        continue;
      }
      const pairValue = pendingDigit + digit! * 91;
      pendingDigit = -1;
      buffer |= pairValue << count;
      count += (pairValue & 8191) > 88 ? 13 : 14;
      while (count > 7) {
        bytes.push(buffer & 255);
        buffer >>>= 8;
        count -= 8;
      }
    }
    if (pendingDigit >= 0) {
      const finalByte = buffer | (pendingDigit << count);
      if (finalByte > 255)
        simpleError(
          field,
          `${field} trailing group does not encode a complete byte.`,
          "invalid_length",
        );
      bytes.push(finalByte);
    }
    return bytes;
  },
  encode: (bytes): string => {
    let buffer = 0;
    let count = 0;
    let output = "";
    for (const byte of bytes) {
      buffer |= byte << count;
      count += 8;
      if (count > 13) {
        let value = buffer & 8191;
        if (value > 88) {
          buffer >>>= 13;
          count -= 13;
        } else {
          value = buffer & 16383;
          buffer >>>= 14;
          count -= 14;
        }
        output +=
          base91Alphabet[value % 91]! + base91Alphabet[Math.floor(value / 91)]!;
      }
    }
    if (count > 0) {
      output += base91Alphabet[buffer % 91]!;
      if (count > 7 || buffer > 90)
        output += base91Alphabet[Math.floor(buffer / 91)]!;
    }
    return output;
  },
};

export const uuEncode = (
  bytes: readonly number[],
  bytesPerLine = 45,
): string => {
  if (!Number.isInteger(bytesPerLine) || bytesPerLine < 1 || bytesPerLine > 45)
    simpleError(
      "lineBytes",
      "lineBytes must be an integer between 1 and 45.",
      "invalid_length",
    );
  const lines: string[] = [];
  for (let offset = 0; offset < bytes.length; offset += bytesPerLine) {
    const group = bytes.slice(offset, offset + bytesPerLine);
    let line = String.fromCharCode(32 + group.length)!;
    for (let index = 0; index < group.length; index += 3) {
      const packed =
        ((group[index]! << 16) |
          ((group[index + 1] ?? 0) << 8) |
          (group[index + 2] ?? 0)) >>>
        0;
      for (let shift = 18; shift >= 0; shift -= 6) {
        const digit = (packed >>> shift) & 63;
        line += String.fromCharCode(digit === 0 ? 32 : 32 + digit)!;
      }
    }
    lines.push(line);
  }
  return lines.join("\n");
};

export const uuDecode = (value: string, field = "uu"): number[] => {
  const body = value.endsWith("\n") ? value.slice(0, -1) : value;
  if (body.length === 0) return [];
  const bytes: number[] = [];
  for (const line of body.split("\n")) {
    if (line.length === 0)
      simpleError(
        field,
        `${field} contains an empty line.`,
        "invalid_length",
      );
    const count = line.charCodeAt(0)! - 32;
    if (count < 1 || count > 45)
      simpleError(
        field,
        `${field} line length indicator is out of range.`,
        "invalid_length",
      );
    if (line.length - 1 !== Math.ceil(count / 3) * 4)
      simpleError(
        field,
        `${field} line does not match its length indicator.`,
        "invalid_length",
      );
    let remaining = count;
    for (let index = 1; index < line.length; index += 4) {
      let packed = 0;
      for (let offset = 0; offset < 4; offset += 1) {
        const code = line.charCodeAt(index + offset)!;
        const digit = code === 96 ? 0 : code - 32;
        if (digit < 0 || digit > 63)
          simpleError(
            field,
            `${field} contains a character outside the uu alphabet.`,
            "invalid_character",
          );
        packed = (packed << 6) | digit;
      }
      const take = Math.min(3, remaining);
      bytes.push((packed >>> 16) & 255);
      if (take > 1) bytes.push((packed >>> 8) & 255);
      if (take > 2) bytes.push(packed & 255);
      remaining -= take;
    }
  }
  return bytes;
};

export type Base122Codec = {
  readonly decode: (bytes: readonly number[], field?: string) => number[];
  readonly encode: (bytes: readonly number[]) => number[];
};

export type Base122CodecConfig = {
  readonly illegalBytes?: readonly number[];
};

export const base122IllegalBytes: readonly number[] = [
  0, 10, 13, 34, 38, 92,
];

export const createBase122Codec = (
  config: Base122CodecConfig = {},
): Base122Codec => {
  const illegalBytes =
    config.illegalBytes === undefined
      ? base122IllegalBytes
      : config.illegalBytes;
  return {
    encode: (bytes): number[] => {
      const output: number[] = [];
      let index = 0;
      let bitOffset = 0;
      const get7 = (): number | false => {
        if (index >= bytes.length) return false;
        const firstByte = bytes[index]!;
        let firstPart = ((0b11111110 >>> bitOffset) & firstByte) << bitOffset;
        firstPart >>= 1;
        bitOffset += 7;
        if (bitOffset < 8) return firstPart;
        bitOffset -= 8;
        index += 1;
        if (index >= bytes.length) return firstPart;
        const secondPart =
          (((0xff00 >>> bitOffset) & bytes[index]!) & 255) >> (8 - bitOffset);
        return firstPart | secondPart;
      };
      while (true) {
        const bits = get7();
        if (bits === false) break;
        const illegalIndex = illegalBytes.indexOf(bits);
        if (illegalIndex === -1) {
          output.push(bits);
          continue;
        }
        let nextBits = get7();
        const shortened = nextBits === false;
        const payload = shortened ? bits : nextBits!;
        const lead =
          0b11000010 |
          ((shortened ? 7 : illegalIndex) << 2) |
          ((payload & 64) === 0 ? 0 : 1);
        output.push(lead, 0b10000000 | (payload & 63));
      }
      return output;
    },
    decode: (input, field = "value"): number[] => {
      const decoded: number[] = [];
      let currentByte = 0;
      let bitsOfByte = 0;
      const push7 = (byte: number): void => {
        const shifted = byte << 1;
        currentByte |= shifted >>> bitsOfByte;
        bitsOfByte += 7;
        if (bitsOfByte >= 8) {
          decoded.push(currentByte & 255);
          bitsOfByte -= 8;
          currentByte = (shifted << (7 - bitsOfByte)) & 255;
        }
      };
      let index = 0;
      while (index < input.length) {
        const lead = input[index]!;
        index += 1;
        if (lead < 128) {
          push7(lead);
          continue;
        }
        if (lead < 192 || lead >= 224)
          simpleError(
            field,
            `${field} contains a byte that does not start a valid sequence.`,
            "invalid_character",
          );
        const continuation = input[index];
        if (continuation === undefined)
          simpleError(
            field,
            `${field} ends with a truncated escape sequence.`,
            "invalid_length",
          );
        index += 1;
        if (continuation < 128 || continuation >= 192)
          simpleError(
            field,
            `${field} contains an invalid escape continuation byte.`,
            "invalid_character",
          );
        const codePoint = ((lead & 31) << 6) | (continuation & 63);
        const illegalIndex = (codePoint >>> 8) & 7;
        const payload = codePoint & 127;
        if (illegalIndex !== 7) {
          const illegalValue = illegalBytes[illegalIndex];
          if (illegalValue === undefined)
            simpleError(
              field,
              `${field} contains an unknown escape sequence.`,
              "invalid_character",
            );
          push7(illegalValue!);
        }
        push7(payload);
      }
      if (
        bitsOfByte > 0 &&
        currentByte >>> (8 - bitsOfByte) !== 0
      )
        simpleError(
          field,
          `${field} trailing bits are not zero and therefore not canonical.`,
          "non_canonical_bits",
        );
      return decoded;
    },
  };
};

export const base122Codec = createBase122Codec();
