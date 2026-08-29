import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type ByteSizeStandard = "iec" | "si";

export type ByteSizeInput = {
  readonly bytes: number;
  readonly precision?: number;
  readonly standard?: ByteSizeStandard;
};

export type ByteSizeOutput = {
  readonly formatted: string;
  readonly unit: string;
  readonly value: number;
};

const SI_UNITS = ["B", "kB", "MB", "GB", "TB", "PB"] as const;
const IEC_UNITS = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"] as const;

export const byteSizeInputSchema = {
  additionalProperties: false,
  properties: {
    bytes: {
      description: "Quantity of bytes to format.",
      minimum: 0,
      type: "integer",
    },
    precision: {
      description: "Decimal places kept on the scaled value.",
      maximum: 3,
      minimum: 0,
      type: "integer",
    },
    standard: {
      description: "SI powers of 1000 or IEC powers of 1024.",
      enum: ["si", "iec"],
      type: "string",
    },
  },
  required: ["bytes"],
  type: "object",
} as const;

export const byteSizeOutputSchema = {
  additionalProperties: false,
  properties: {
    formatted: {
      description: "Human-readable size such as 1.5 kB.",
      type: "string",
    },
    unit: {
      description: "Selected unit symbol.",
      enum: [...new Set([...SI_UNITS, ...IEC_UNITS])],
      type: "string",
    },
    value: {
      description: "Scaled magnitude after rounding.",
      minimum: 0,
      type: "number",
    },
  },
  required: ["formatted", "unit", "value"],
  type: "object",
} as const;

export const byteSizeExample = {
  input: { bytes: 1500, precision: 1, standard: "si" },
  output: { formatted: "1.5 kB", unit: "kB", value: 1.5 },
} satisfies ToolExample<ByteSizeInput, ByteSizeOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isByteSizeOutput = (value: unknown): value is ByteSizeOutput =>
  isRecord(value) &&
  typeof value.formatted === "string" &&
  typeof value.unit === "string" &&
  typeof value.value === "number";

export const calculateByteSize = (
  input: unknown,
): ToolResult<ByteSizeOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set(["bytes", "precision", "standard"]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const rawBytes = input.bytes;
  let bytes: number | undefined;
  if (rawBytes === undefined)
    issues.push({
      code: "bytes_required",
      field: "bytes",
      message: "bytes is required.",
    });
  else if (!Number.isSafeInteger(rawBytes) || (rawBytes as number) < 0)
    issues.push({
      code: "bytes_invalid",
      field: "bytes",
      message: "bytes must be a nonnegative safe integer.",
    });
  else bytes = rawBytes as number;

  const precisionInput = input.precision;
  const rawPrecision =
    precisionInput === undefined ? 1 : (precisionInput as number);
  if (
    !Number.isSafeInteger(rawPrecision) ||
    rawPrecision < 0 ||
    rawPrecision > 3
  )
    issues.push({
      code: "precision_invalid",
      field: "precision",
      message: "precision must be an integer between 0 and 3.",
    });

  const standard = input.standard ?? "si";
  if (standard !== "si" && standard !== "iec")
    issues.push({
      code: "standard_invalid",
      field: "standard",
      message: "standard must be si or iec.",
    });

  if (issues.length > 0) return invalidInput(issues);

  const resolvedBytes = bytes as number;
  const base = standard === "si" ? 1000 : 1024;
  const units =
    standard === "si"
      ? (SI_UNITS as readonly string[])
      : (IEC_UNITS as readonly string[]);
  let unitIndex = 0;
  if (resolvedBytes > 0) {
    unitIndex = Math.floor(Math.log(resolvedBytes) / Math.log(base));
    unitIndex = Math.min(unitIndex, units.length - 1);
  }
  const scale = base ** unitIndex;
  const factor = 10 ** (rawPrecision as number);
  const value = Math.round((resolvedBytes / scale) * factor) / factor;

  return toolSuccess({
    formatted: `${value} ${units[unitIndex]}`,
    unit: units[unitIndex],
    value,
  });
};

export const byteSizeTool = defineTool<ByteSizeInput, ByteSizeOutput>({
  contractVersion: 1,
  description:
    "Format a byte count as human-readable text using SI or IEC unit conventions.",
  discovery: {
    aliases: ["file-size-format", "human-bytes"],
    keywords: ["bytes", "filesize", "format", "storage"],
  },
  execute: calculateByteSize,
  execution: { kind: "pure" },
  id: "format/byte-size",
  inputSchema: byteSizeInputSchema,
  outputSchema: byteSizeOutputSchema,
  ports: {
    inputs: [
      {
        description: "Quantity of bytes to format.",
        id: "bytes",
        label: "Bytes",
        required: true,
        valueType: { format: "data-size", type: "integer", unit: "B" },
      },
      {
        description: "Decimal places kept on the scaled value.",
        id: "precision",
        label: "Precision",
        valueType: { type: "integer" },
      },
      {
        description: "Unit convention.",
        id: "standard",
        label: "Standard",
        valueType: { format: "unit-standard", type: "string" },
      },
    ],
    outputs: [
      {
        description: "Human-readable size.",
        id: "formatted",
        label: "Formatted",
        valueType: { format: "display-string", type: "string" },
      },
      {
        description: "Selected unit symbol.",
        id: "unit",
        label: "Unit",
        valueType: { format: "data-size-unit", type: "string" },
      },
      {
        description: "Scaled magnitude after rounding.",
        id: "value",
        label: "Value",
        valueType: { type: "number" },
      },
    ],
  },
  title: "Byte Size Formatter",
});

export const runByteSize = byteSizeTool.execute;
export default byteSizeTool;
