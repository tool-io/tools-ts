import type { TableDataType, TableJsonValue } from "./definition.js";

const numberPattern = /^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?$/u;
const integerPattern = /^[-+]?\d+$/u;
const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/u;
const minimumInt64 = -(2n ** 63n);
const maximumInt64 = 2n ** 63n - 1n;

const isCalendarDate = (value: string): boolean => {
  const match = datePattern.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return month >= 1 && month <= 12 && day >= 1 && day <= (days[month - 1] ?? 0);
};

const isInt64 = (value: string): boolean => {
  if (!integerPattern.test(value)) return false;
  const integer = BigInt(value);
  return integer >= minimumInt64 && integer <= maximumInt64;
};

export const tableFieldId = (label: string, index: number): string => {
  const normalized = label
    .normalize("NFKD")
    .replace(/[^A-Za-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .toLowerCase();
  return /^[a-z]/u.test(normalized) ? normalized : `column-${index + 1}`;
};

export const tableFieldIds = (labels: readonly string[]): readonly string[] => {
  const used = new Set<string>();
  return labels.map((label, index) => {
    const base = tableFieldId(label, index);
    let id = base;
    let suffix = 2;
    while (used.has(id)) {
      id = `${base}-${suffix}`;
      suffix += 1;
    }
    used.add(id);
    return id;
  });
};

export const inferTextTableDataType = (
  cells: readonly string[],
): TableDataType => {
  const values = cells.map((cell) => cell.trim()).filter((cell) => cell !== "");
  if (values.length === 0) return { kind: "string" };
  if (values.every((cell) => /^(?:true|false)$/iu.test(cell)))
    return { kind: "boolean" };
  if (values.every(isInt64)) return { bits: 64, kind: "integer", signed: true };
  if (
    values.every(
      (cell) => numberPattern.test(cell) && Number.isFinite(Number(cell)),
    )
  )
    return { bits: 64, kind: "float" };
  if (values.every(isCalendarDate)) return { kind: "date" };
  return { kind: "string" };
};

export const coerceTextTableCell = (
  cell: string,
  type: TableDataType,
): TableJsonValue => {
  const value = cell.trim();
  if (value === "") return null;
  if (type.kind === "boolean") return value.toLowerCase() === "true";
  if (type.kind === "integer") {
    const number = Number(value);
    return Number.isSafeInteger(number) ? number : value.replace(/^\+/u, "");
  }
  if (type.kind === "float") return Number(value);
  return cell;
};

const isJsonCell = (value: unknown): value is TableJsonValue => {
  if (value === null || typeof value === "boolean" || typeof value === "string")
    return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(isJsonCell);
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every(isJsonCell)
  );
};

export const inferJsonTableDataType = (
  cells: readonly TableJsonValue[],
): TableDataType => {
  const values = cells.filter((cell) => cell !== null);
  if (values.length === 0) return { kind: "json" };
  if (values.every((cell) => typeof cell === "boolean"))
    return { kind: "boolean" };
  if (
    values.every(
      (cell) => typeof cell === "number" && Number.isSafeInteger(cell),
    )
  )
    return { bits: 64, kind: "integer", signed: true };
  if (values.every((cell) => typeof cell === "number"))
    return { bits: 64, kind: "float" };
  if (values.every((cell) => typeof cell === "string")) {
    if ((values as string[]).every(isCalendarDate)) return { kind: "date" };
    return { kind: "string" };
  }
  return { kind: "json" };
};

export const asTableJsonValue = (value: unknown): TableJsonValue | undefined =>
  isJsonCell(value) ? value : undefined;
