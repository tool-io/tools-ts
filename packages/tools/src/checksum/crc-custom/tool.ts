import { defineTool } from "../../core/definition.js";
import { utf8Encode } from "../../core/encoding.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess } from "../../core/result.js";
import { crc } from "../crc.js";

export type CustomCrcInput = {
  readonly initialValue?: string;
  readonly polynomial: string;
  readonly reflectInput?: boolean;
  readonly reflectOutput?: boolean;
  readonly text: string;
  readonly width: number;
  readonly xorOutput?: string;
};
export type CustomCrcOutput = { readonly checksum: string };

const hex = (value: unknown): bigint | null =>
  typeof value === "string" && /^(?:0x)?[0-9a-f]+$/iu.test(value)
    ? BigInt(value.toLowerCase().startsWith("0x") ? value : `0x${value}`)
    : null;

export const calculateCustomCrc = (input: unknown) => {
  if (typeof input !== "object" || input === null || Array.isArray(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const record = input as Record<string, unknown>;
  const width = record.width;
  const polynomial = hex(record.polynomial);
  const initialValue = hex(record.initialValue ?? "0");
  const xorOutput = hex(record.xorOutput ?? "0");
  if (typeof record.text !== "string")
    return invalidInput([
      { code: "text_required", field: "text", message: "Text is required." },
    ]);
  if (
    !Number.isInteger(width) ||
    (width as number) < 8 ||
    (width as number) > 64
  )
    return invalidInput([
      {
        code: "width_invalid",
        field: "width",
        message: "Width must be an integer from 8 through 64 bits.",
      },
    ]);
  if (
    polynomial === null ||
    polynomial < 1n ||
    polynomial >= 1n << BigInt(width as number)
  )
    return invalidInput([
      {
        code: "polynomial_invalid",
        field: "polynomial",
        message:
          "Polynomial must be nonzero hexadecimal that fits the selected width.",
      },
    ]);
  const mask = (1n << BigInt(width as number)) - 1n;
  if (initialValue === null || initialValue > mask)
    return invalidInput([
      {
        code: "initial_value_invalid",
        field: "initialValue",
        message:
          "Initial value must be hexadecimal that fits the selected width.",
      },
    ]);
  if (xorOutput === null || xorOutput > mask)
    return invalidInput([
      {
        code: "xor_output_invalid",
        field: "xorOutput",
        message: "Final XOR must be hexadecimal that fits the selected width.",
      },
    ]);
  if (
    record.reflectInput !== undefined &&
    typeof record.reflectInput !== "boolean"
  )
    return invalidInput([
      {
        code: "reflect_input_invalid",
        field: "reflectInput",
        message: "Reflect input must be true or false.",
      },
    ]);
  if (
    record.reflectOutput !== undefined &&
    typeof record.reflectOutput !== "boolean"
  )
    return invalidInput([
      {
        code: "reflect_output_invalid",
        field: "reflectOutput",
        message: "Reflect output must be true or false.",
      },
    ]);
  const checksum = crc(utf8Encode(record.text), {
    init: initialValue,
    polynomial,
    reflectInput: record.reflectInput ?? false,
    reflectOutput: record.reflectOutput ?? false,
    width: width as number,
    xorOutput,
  });
  return toolSuccess({
    checksum: checksum
      .toString(16)
      .toUpperCase()
      .padStart(Math.ceil((width as number) / 4), "0"),
  });
};

export const example = {
  input: {
    initialValue: "FFFFFFFF",
    polynomial: "04C11DB7",
    reflectInput: true,
    reflectOutput: true,
    text: "123456789",
    width: 32,
    xorOutput: "FFFFFFFF",
  },
  output: { checksum: "CBF43926" },
} satisfies ToolExample<CustomCrcInput, CustomCrcOutput>;

export const customCrcTool = defineTool<CustomCrcInput, CustomCrcOutput>({
  contractVersion: 1,
  description:
    "Calculate a custom 8- through 64-bit CRC by setting its width, polynomial, initial register, reflection flags, and final XOR value.",
  discovery: {
    aliases: ["custom crc", "crc calculator", "crc parameters"],
    collections: ["encode-decode"],
    keywords: ["checksum", "crc", "polynomial"],
  },
  execute: calculateCustomCrc,
  execution: { kind: "pure" },
  id: "checksum/crc-custom",
  inputSchema: {
    additionalProperties: false,
    properties: {
      initialValue: { default: "FFFFFFFF", type: "string" },
      polynomial: { default: "04C11DB7", type: "string" },
      reflectInput: { default: true, type: "boolean" },
      reflectOutput: { default: true, type: "boolean" },
      text: { maxLength: 1_000_000, type: "string" },
      width: { default: 32, maximum: 64, minimum: 8, type: "integer" },
      xorOutput: { default: "FFFFFFFF", type: "string" },
    },
    required: ["text", "width", "polynomial"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: { checksum: { pattern: "^[0-9A-F]{2,16}$", type: "string" } },
    required: ["checksum"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "text",
        label: "Text",
        required: true,
        valueType: { format: "text", type: "string" },
      },
      {
        id: "width",
        label: "Width (bits)",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "polynomial",
        label: "Polynomial (hex)",
        required: true,
        valueType: { format: "hex", type: "string" },
      },
      {
        id: "initialValue",
        label: "Initial value (hex)",
        valueType: { format: "hex", type: "string" },
      },
      {
        id: "xorOutput",
        label: "Final XOR (hex)",
        valueType: { format: "hex", type: "string" },
      },
      {
        id: "reflectInput",
        label: "Reflect input",
        valueType: { type: "boolean" },
      },
      {
        id: "reflectOutput",
        label: "Reflect output",
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      {
        id: "checksum",
        label: "Checksum",
        valueType: { format: "hex", type: "string" },
      },
    ],
  },
  title: "Custom CRC Calculator",
});
export const runCustomCrc = customCrcTool.execute;
export default customCrcTool;
