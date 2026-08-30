import {
  gs1CheckDigit,
  stripIdentifierSeparators,
  validGs1,
} from "./shared.js";

export const expandUpcE = (value: string): string | null => {
  const normalized = stripIdentifierSeparators(value);
  if (!/^[01]\d{7}$/u.test(normalized)) return null;
  const [numberSystem, x1, x2, x3, x4, x5, x6, checkDigit] = normalized;
  let data: string;
  if (x6 === "0" || x6 === "1" || x6 === "2")
    data = `${numberSystem}${x1}${x2}${x6}00` + `00${x3}${x4}${x5}`;
  else if (x6 === "3")
    data = `${numberSystem}${x1}${x2}${x3}00` + `000${x4}${x5}`;
  else if (x6 === "4")
    data = `${numberSystem}${x1}${x2}${x3}${x4}0` + `0000${x5}`;
  else data = `${numberSystem}${x1}${x2}${x3}${x4}${x5}` + `0000${x6}`;
  return gs1CheckDigit(data) === checkDigit ? `${data}${checkDigit}` : null;
};

export const compressUpcA = (value: string): string | null => {
  const normalized = stripIdentifierSeparators(value);
  if (!/^[01]\d{11}$/u.test(normalized) || !validGs1(normalized, 12))
    return null;
  const numberSystem = normalized[0]!;
  const manufacturer = normalized.slice(1, 6);
  const product = normalized.slice(6, 11);
  const checkDigit = normalized[11]!;
  let compressed: string | null = null;
  if (
    ["0", "1", "2"].includes(manufacturer[2]!) &&
    manufacturer.slice(3) === "00" &&
    product.startsWith("00")
  )
    compressed = `${manufacturer.slice(0, 2)}${product.slice(2)}${manufacturer[2]}`;
  else if (manufacturer.endsWith("00") && product.startsWith("000"))
    compressed = `${manufacturer.slice(0, 3)}${product.slice(3)}3`;
  else if (manufacturer.endsWith("0") && product.startsWith("0000"))
    compressed = `${manufacturer.slice(0, 4)}${product[4]}4`;
  else if (product.startsWith("0000") && Number(product[4]) >= 5)
    compressed = `${manufacturer}${product[4]}`;
  return compressed === null
    ? null
    : `${numberSystem}${compressed}${checkDigit}`;
};
