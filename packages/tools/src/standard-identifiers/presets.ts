import {
  gs1CheckDigit,
  isbn10CheckDigit,
  issnCheckDigit,
  type GeneratorConfig,
  type ValidatorConfig,
  validGs1,
} from "./shared.js";

const gs1Generator = (
  id: GeneratorConfig["id"],
  title: string,
  description: string,
  dataLength: number,
  exampleData: string,
  keywords: readonly string[],
  validateData?: GeneratorConfig["validateData"],
): GeneratorConfig => ({
  build: (data) => `${data}${gs1CheckDigit(data)}`,
  dataLength,
  description,
  exampleData,
  id,
  keywords,
  title,
  validateData,
});

export const isbn10Generator = {
  build: (data) => `${data}${isbn10CheckDigit(data)}`,
  dataLength: 9,
  description:
    "Append the ISO 2108 modulus-11 check character to nine ISBN-10 data digits; the result is structurally valid but is not an assigned publication identifier.",
  exampleData: "030640615",
  id: "generate/isbn-10",
  keywords: ["book", "isbn", "publishing"],
  title: "ISBN-10 Generator",
} satisfies GeneratorConfig;
export const isbn13Generator = gs1Generator(
  "generate/isbn-13",
  "ISBN-13 Generator",
  "Append the GS1 modulus-10 check digit to twelve Bookland data digits beginning with 978 or an ISBN-capable 979 prefix; this does not assign an ISBN.",
  12,
  "978030640615",
  ["book", "bookland", "isbn"],
  (data) =>
    data.startsWith("978") ||
    (data.startsWith("979") && !data.startsWith("9790"))
      ? null
      : "ISBN-13 data must begin with 978 or an ISBN-capable 979 prefix; 979-0 is reserved for ISMN.",
);
export const ean8Generator = gs1Generator(
  "generate/ean-8",
  "EAN-8 Generator",
  "Append the GS1 modulus-10 check digit to seven EAN-8 data digits without claiming allocation by a GS1 member organization.",
  7,
  "9638507",
  ["ean", "gtin-8", "product code"],
);
export const ean13Generator = gs1Generator(
  "generate/ean-13",
  "EAN-13 Generator",
  "Append the GS1 modulus-10 check digit to twelve EAN-13 data digits without claiming that the resulting GTIN-13 has been assigned.",
  12,
  "400638133393",
  ["ean", "gtin-13", "product code"],
);
export const upcAGenerator = gs1Generator(
  "generate/upc-a",
  "UPC-A Generator",
  "Append the GS1 modulus-10 check digit to eleven UPC-A data digits without claiming allocation of the resulting GTIN-12.",
  11,
  "03600029145",
  ["gtin-12", "product code", "upc"],
);
export const gtin14Generator = gs1Generator(
  "generate/gtin-14",
  "GTIN-14 Generator",
  "Append the GS1 modulus-10 check digit to thirteen GTIN-14 data digits; structural validity does not establish an assigned company prefix or item reference.",
  13,
  "1061414112345",
  ["gs1", "gtin", "trade item"],
);
export const issnGenerator = {
  build: (data) => `${data}${issnCheckDigit(data)}`,
  dataLength: 7,
  description:
    "Append the ISSN modulus-11 check character to seven data digits; the result passes the checksum but is not an ISSN assignment.",
  exampleData: "0317847",
  id: "generate/issn",
  keywords: ["journal", "periodical", "serial"],
  title: "ISSN Generator",
} satisfies GeneratorConfig;
export const ismn13Generator = gs1Generator(
  "generate/ismn-13",
  "ISMN-13 Generator",
  "Append the GS1 modulus-10 check digit to twelve ISMN data digits beginning with 9790; the result is structural and not an agency assignment.",
  12,
  "979023067118",
  ["ismn", "music", "notated music"],
  (data) =>
    data.startsWith("9790") ? null : "ISMN-13 data must begin with 9790.",
);
export const ismn10Generator = {
  build: (data) => `M${data}${gs1CheckDigit(`9790${data}`)}`,
  dataLength: 8,
  description:
    "Build a legacy ten-character ISMN from M, eight data digits, and the checksum shared with its 979-0 conversion; legacy format does not imply assignment.",
  exampleData: "23067118",
  id: "generate/ismn-10",
  keywords: ["ismn", "legacy", "music"],
  title: "Legacy ISMN-10 Generator",
} satisfies GeneratorConfig;
export const janGenerator = gs1Generator(
  "generate/jan",
  "JAN Generator",
  "Append the GS1 modulus-10 check digit to twelve JAN data digits beginning with Japan's 45 or 49 GS1 prefix; this does not allocate a product code.",
  12,
  "490123456789",
  ["ean-13", "japan", "jan"],
  (data) =>
    data.startsWith("45") || data.startsWith("49")
      ? null
      : "JAN data must begin with the 45 or 49 GS1 prefix used for Japan.",
);

const gs1Validator = (
  id: ValidatorConfig["id"],
  title: string,
  description: string,
  type: string,
  length: number,
  exampleIdentifier: string,
  keywords: readonly string[],
  extra?: (identifier: string) => boolean,
): ValidatorConfig => ({
  description,
  exampleIdentifier,
  id,
  keywords,
  title,
  type,
  validate: (identifier) =>
    validGs1(identifier, length) && (extra?.(identifier) ?? true),
});

export const ean8Validator = gs1Validator(
  "validate/ean-8",
  "EAN-8 Validator",
  "Validate the length, decimal syntax, and GS1 modulus-10 check digit of an EAN-8 symbol value without querying allocation records.",
  "EAN-8 / GTIN-8",
  8,
  "96385074",
  ["ean", "gtin-8", "product code"],
);
export const ean13Validator = gs1Validator(
  "validate/ean-13",
  "EAN-13 Validator",
  "Validate the length, decimal syntax, and GS1 modulus-10 check digit of an EAN-13 symbol value without querying allocation records.",
  "EAN-13 / GTIN-13",
  13,
  "4006381333931",
  ["ean", "gtin-13", "product code"],
);
export const upcAValidator = gs1Validator(
  "validate/upc-a",
  "UPC-A Validator",
  "Validate the length, decimal syntax, and GS1 modulus-10 check digit of a UPC-A symbol value without querying allocation records.",
  "UPC-A / GTIN-12",
  12,
  "036000291452",
  ["gtin-12", "product code", "upc"],
);
export const janValidator = gs1Validator(
  "validate/jan",
  "JAN Validator",
  "Validate a 13-digit JAN value by its Japan GS1 prefix and GS1 modulus-10 check digit without checking product assignment.",
  "JAN / GTIN-13",
  13,
  "4901234567894",
  ["ean-13", "japan", "jan"],
  (identifier) => identifier.startsWith("45") || identifier.startsWith("49"),
);
export const issnValidator = {
  description:
    "Validate an ISSN by normalizing spaces and its optional hyphen, checking seven data digits, and verifying the modulus-11 check character.",
  exampleIdentifier: "0317-8471",
  id: "validate/issn",
  keywords: ["journal", "periodical", "serial"],
  title: "ISSN Validator",
  type: "ISSN",
  validate: (identifier) =>
    /^\d{7}[\dX]$/u.test(identifier) &&
    issnCheckDigit(identifier.slice(0, 7)) === identifier.at(-1),
} satisfies ValidatorConfig;
export const ismnValidator = {
  description:
    "Validate current 13-digit 979-0 ISMNs and legacy M-prefixed ten-character ISMNs by their format and shared modulus-10 check digit.",
  exampleIdentifier: "979-0-2306-7118-7",
  id: "validate/ismn",
  keywords: ["ismn", "music", "notated music"],
  title: "ISMN Validator",
  type: "ISMN",
  validate: (identifier) => {
    if (/^9790\d{8}\d$/u.test(identifier)) return validGs1(identifier, 13);
    if (/^M\d{8}\d$/u.test(identifier))
      return (
        gs1CheckDigit(`9790${identifier.slice(1, -1)}`) === identifier.at(-1)
      );
    return false;
  },
} satisfies ValidatorConfig;
