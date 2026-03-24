export const binaryBytesType = "binary/bytes";
export const booleanType = "boolean";
export const colorHexType = "color/hex";
export const colorHslType = "color/hsl";
export const colorHsvType = "color/hsv";
export const colorOklchType = "color/oklch";
export const colorRgbType = "color/rgb";
export const currencyAmountType = "currency/amount";
export const dateCalendarType = "date/calendar";
export const datetimeInstantType = "datetime/instant";
export const documentToolioType = "document/toolio";
export const fileReferenceType = "file/reference";
export const indexBodyMassType = "index/body-mass";
export const integerSafeType = "integer/safe";
export const jsonValueType = "json/value";
export const listTextType = "list/text";
export const matrixNumberType = "matrix/number";
export const numberFiniteType = "number/finite";
export const percentageDecimalType = "percentage/decimal";
export const quantityLengthType = "quantity/length";
export const quantityLengthCentimetersType = "quantity/length/cm";
export const quantityLengthMetersType = "quantity/length/m";
export const quantityMassKilogramsType = "quantity/mass/kg";
export const tableDataType = "table/data";
export const textCsvType = "text/csv";
export const textHtmlType = "text/html";
export const textJsonType = "text/json";
export const textLatexType = "text/latex";
export const textMarkdownType = "text/markdown";
export const textPlainType = "text/plain";
export const timeClockType = "time/clock";
export const unitMeasurementType = "unit/measurement";

export const toolSemanticTypes = {
  binaryBytes: binaryBytesType,
  boolean: booleanType,
  colorHex: colorHexType,
  colorHsl: colorHslType,
  colorHsv: colorHsvType,
  colorOklch: colorOklchType,
  colorRgb: colorRgbType,
  currencyAmount: currencyAmountType,
  dateCalendar: dateCalendarType,
  datetimeInstant: datetimeInstantType,
  documentToolio: documentToolioType,
  fileReference: fileReferenceType,
  indexBodyMass: indexBodyMassType,
  integerSafe: integerSafeType,
  jsonValue: jsonValueType,
  listText: listTextType,
  matrixNumber: matrixNumberType,
  numberFinite: numberFiniteType,
  percentageDecimal: percentageDecimalType,
  quantityLength: quantityLengthType,
  quantityLengthCentimeters: quantityLengthCentimetersType,
  quantityLengthMeters: quantityLengthMetersType,
  quantityMassKilograms: quantityMassKilogramsType,
  tableData: tableDataType,
  textCsv: textCsvType,
  textHtml: textHtmlType,
  textJson: textJsonType,
  textLatex: textLatexType,
  textMarkdown: textMarkdownType,
  textPlain: textPlainType,
  timeClock: timeClockType,
  unitMeasurement: unitMeasurementType,
} as const;

export type ToolSemanticType =
  (typeof toolSemanticTypes)[keyof typeof toolSemanticTypes];

const semanticTypeSet = new Set<string>(Object.values(toolSemanticTypes));

export const isToolSemanticType = (value: unknown): value is ToolSemanticType =>
  typeof value === "string" && semanticTypeSet.has(value);
