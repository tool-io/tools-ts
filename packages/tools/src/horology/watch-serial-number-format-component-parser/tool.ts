import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SerialNumberComponentInput = {
  readonly serialNumber: string;
};

export type SerialNumberComponentOutput = {
  readonly componentCount: number;
  readonly dateInference: "notProvided";
  readonly numericBody: string;
  readonly parseCaution: string;
  readonly prefix: string;
  readonly suffix: string;
};

export const parseWatchSerialNumberComponents = (
  input: SerialNumberComponentInput,
): SerialNumberComponentOutput => {
  const normalized = input.serialNumber.trim().toUpperCase();
  const match = /^([A-Z]*)-?(\d{4,})(-[A-Z]+)?$/.exec(normalized);
  if (match === null)
    return simpleError(
      "serialNumber",
      "Serial number must contain a four-or-more-digit body with optional alphabetic prefix and hyphenated suffix.",
      "unsupported_serial_format",
    );
  const prefix = match[1] ?? "";
  const numericBody = match[2];
  if (numericBody === undefined)
    return simpleError(
      "serialNumber",
      "Serial number must contain a numeric body.",
      "serial_format_invalid",
    );
  const suffix = match[3]?.slice(1) ?? "";
  return {
    componentCount: 1 + Number(prefix.length > 0) + Number(suffix.length > 0),
    dateInference: "notProvided",
    numericBody,
    parseCaution:
      "This parser exposes character components only. Brand-specific serial allocation, production date, and model attribution require authoritative references.",
    prefix,
    suffix,
  };
};

export const serialNumberComponentExample = {
  input: { serialNumber: " ab-123456-c " },
  output: {
    componentCount: 3,
    dateInference: "notProvided",
    numericBody: "123456",
    parseCaution:
      "This parser exposes character components only. Brand-specific serial allocation, production date, and model attribution require authoritative references.",
    prefix: "AB",
    suffix: "C",
  },
} satisfies ToolExample<
  SerialNumberComponentInput,
  SerialNumberComponentOutput
>;

export const serialNumberComponentTool = createSimpleTool({
  calculate: (input) =>
    parseWatchSerialNumberComponents({
      serialNumber: input.serialNumber as string,
    }),
  description:
    "Parse a generic prefix-numeric-suffix watch serial format without assigning a brand, decade, production date, or model from the number alone.",
  id: "horology/watch-serial-number-format-component-parser",
  inputs: [
    { id: "serialNumber", kind: "string", label: "Watch serial number" },
  ],
  outputs: [
    {
      id: "componentCount",
      kind: "integer",
      label: "Nonempty component count",
      minimum: 1,
    },
    {
      enum: ["notProvided"],
      id: "dateInference",
      kind: "string",
      label: "Date inference",
    },
    { id: "numericBody", kind: "string", label: "Numeric serial body" },
    { id: "parseCaution", kind: "string", label: "Parsing caution" },
    { id: "prefix", kind: "string", label: "Alphabetic prefix" },
    { id: "suffix", kind: "string", label: "Alphabetic suffix" },
  ],
  title: "Watch Serial Number Format Component Parser",
});

export const runSerialNumberComponent = serialNumberComponentTool.execute;
export default serialNumberComponentTool;
