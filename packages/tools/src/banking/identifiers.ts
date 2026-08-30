import { simpleError } from "../core/simple.js";
export const aba = (text: string): boolean => {
  if (!/^[0-9]{9}$(?![\s\S])/.test(text))
    return simpleError(
      "routing",
      "Exactly nine ASCII routing digits required, preserving leading zeros.",
    );
  return (
    [...text].reduce((s, c, i) => s + Number(c) * [3, 7, 1][i % 3], 0) % 10 ===
    0
  );
};
export const bic = (
  text: string,
): {
  institutionCode: string;
  countryCode: string;
  locationCode: string;
  branchCode: string;
} => {
  if (!/^[A-Z0-9]{4}[A-Z]{2}[A-Z0-9]{2}(?:[A-Z0-9]{3})?$(?![\s\S])/.test(text))
    return simpleError(
      "bic",
      "Exact uppercase syntactic BIC of eight or eleven characters required; assignment/country existence is not verified.",
    );
  return {
    institutionCode: text.slice(0, 4),
    countryCode: text.slice(4, 6),
    locationCode: text.slice(6, 8),
    branchCode: text.slice(8) || "XXX",
  };
};
export const clabe = (
  text: string,
): { expectedCheckDigit: string; checkDigitMatches: boolean } => {
  if (!/^[0-9]{18}$(?![\s\S])/.test(text))
    return simpleError(
      "clabe",
      "Exactly eighteen ASCII CLABE digits required.",
    );
  const sum = [...text.slice(0, 17)].reduce(
      (s, c, i) => s + ((Number(c) * [3, 7, 1][i % 3]) % 10),
      0,
    ),
    digit = String((10 - (sum % 10)) % 10);
  return { expectedCheckDigit: digit, checkDigitMatches: digit === text[17] };
};
export const nuban = (
  bankCode: string,
  account: string,
): { expectedCheckDigit: string; checkDigitMatches: boolean } => {
  if (
    !/^[0-9]{3}$(?![\s\S])/.test(bankCode) ||
    !/^[0-9]{10}$(?![\s\S])/.test(account)
  )
    return simpleError(
      "nuban",
      "Legacy three-digit bank code and ten-digit NUBAN account required; expanded institution codes are outside this versioned model.",
    );
  const source = bankCode + account.slice(0, 9),
    sum = [...source].reduce(
      (s, c, i) => s + Number(c) * [3, 7, 3, 3, 7, 3, 3, 7, 3, 3, 7, 3][i],
      0,
    ),
    digit = String((10 - (sum % 10)) % 10);
  return { expectedCheckDigit: digit, checkDigitMatches: digit === account[9] };
};
export const micr = (
  line: string,
): {
  routingDigits: string;
  accountDigits: string;
  checkSerialDigits: string;
  routingChecksumMatches: boolean;
} => {
  const m = /^T([0-9]{9})T([0-9]{1,20})U([0-9]{1,10})U$(?![\s\S])/.exec(line);
  if (!m)
    return simpleError(
      "micr",
      "Explicit normalized T<routing>T<account>U<serial>U syntax required, T=transit/U=on-us; raw OCR/vendor layouts are not guessed.",
    );
  return {
    routingDigits: m[1],
    accountDigits: m[2],
    checkSerialDigits: m[3],
    routingChecksumMatches: aba(m[1]),
  };
};
export const mt103 = (
  block: string,
): {
  observedTagNames: string[];
  missingRequiredTagGroups: string[];
  requiredTagGroupsPresent: boolean;
  transactionReference: string;
  valueDateYYMMDD: string;
  currencyCode: string;
  amountDecimalText: string;
} => {
  const normalized = block.replace(/\r\n/g, "\n");
  if (block.length > 16384 || normalized.includes("\r"))
    return simpleError(
      "message",
      "Bounded normalized MT103 block-4 tag lines required; wrappers/FIN encoding are not parsed.",
    );
  const rows = normalized.split("\n"),
    map = new Map<string, string>();
  let current = "";
  for (const row of rows) {
    const m = /^:([0-9]{2}[A-Z]?):(.*)$/.exec(row);
    if (m) {
      if (map.has(m[1]))
        return simpleError(
          "tag",
          "Duplicate MT103 tag not supported by this single-message parser.",
        );
      current = m[1];
      map.set(current, m[2]);
    } else {
      if (!current || !row)
        return simpleError(
          "message",
          "Nonempty tag/continuation lines required.",
        );
      map.set(current, map.get(current)! + "\n" + row);
    }
  }
  const groups = [
      ["20"],
      ["23B"],
      ["32A"],
      ["50A", "50F", "50K"],
      ["59", "59A", "59F"],
      ["71A"],
    ],
    missing = groups
      .filter((g) => !g.some((t) => (map.get(t) ?? "").trim().length > 0))
      .map((g) => g.join("/"));
  for (const g of groups)
    if (g.filter((t) => map.has(t)).length > 1)
      return simpleError(
        "tags",
        "Mutually exclusive required field options must not coexist.",
      );
  let date = "",
    currency = "",
    amount = "";
  if (map.has("32A")) {
    const m = /^([0-9]{6})([A-Z]{3})([0-9]{1,14},[0-9]{0,13})$(?![\s\S])/.exec(
      map.get("32A")!,
    );
    if (!m || m[3].length > 15)
      return simpleError(
        "32A",
        "Explicit YYMMDD/currency/comma-decimal amount with at most fifteen amount characters required; currency-specific precision is not inferred.",
      );
    date = m[1];
    currency = m[2];
    amount = m[3].endsWith(",") ? m[3].slice(0, -1) : m[3].replace(",", ".");
  }
  return {
    observedTagNames: [...map.keys()],
    missingRequiredTagGroups: missing,
    requiredTagGroupsPresent: missing.length === 0,
    transactionReference: map.get("20") ?? "",
    valueDateYYMMDD: date,
    currencyCode: currency,
    amountDecimalText: amount,
  };
};
