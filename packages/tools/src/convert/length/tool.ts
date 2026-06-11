import { defineTool } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";
import {
  quantityLengthType,
  textPlainType,
} from "../../core/semantic-type.js";
import { convertLengthByFactors } from "./calculation.js";
import { isLengthUnit, lengthUnits } from "./factors.js";

export type ConvertLengthInput = {
  readonly fromUnit: string;
  readonly toUnit: string;
  readonly value: number;
};

export type ConvertLengthOutput = {
  readonly unit: string;
  readonly value: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const convertLengthValue = (
  value: number,
  fromUnit: string,
  toUnit: string,
): number =>
  convertLengthByFactors(
    value,
    lengthUnits[fromUnit]!.meters,
    lengthUnits[toUnit]!.meters,
  );

export const convertLength = (
  input: unknown,
): ToolResult<ConvertLengthOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues: ToolIssue[] = [];
  if (typeof input.value !== "number" || !Number.isFinite(input.value))
    issues.push({
      code: "finite_length_required",
      field: "value",
      message: "Length must be a finite number.",
    });
  if (!isLengthUnit(input.fromUnit))
    issues.push({
      code: "unknown_length_unit",
      field: "fromUnit",
      message: "The source length unit is not supported.",
    });
  if (!isLengthUnit(input.toUnit))
    issues.push({
      code: "unknown_length_unit",
      field: "toUnit",
      message: "The destination length unit is not supported.",
    });
  for (const field of Object.keys(input))
    if (field !== "value" && field !== "fromUnit" && field !== "toUnit")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  if (issues.length > 0) return invalidInput(issues);

  const fromUnit = input.fromUnit as string;
  const toUnit = input.toUnit as string;
  const converted = convertLengthValue(input.value as number, fromUnit, toUnit);
  if (!Number.isFinite(converted))
    return invalidInput([
      {
        code: "length_overflow",
        field: "value",
        message: "The converted length exceeds the supported numeric range.",
      },
    ]);

  return toolSuccess({ unit: toUnit, value: converted });
};

export const lengthConversionTool = defineTool<
  ConvertLengthInput,
  ConvertLengthOutput
>({
  contractVersion: 1,
  description: "Convert a finite value between supported length units.",
  execute: convertLength,
  executionKind: "pure",
  id: "convert/length",
  inputSchema: {
    additionalProperties: false,
    properties: {
      fromUnit: { enum: Object.keys(lengthUnits), type: "string" },
      toUnit: { enum: Object.keys(lengthUnits), type: "string" },
      value: { type: "number" },
    },
    required: ["value", "fromUnit", "toUnit"],
    type: "object",
  },
  isOutput: (value): value is ConvertLengthOutput =>
    isRecord(value) &&
    typeof value.value === "number" &&
    Number.isFinite(value.value) &&
    isLengthUnit(value.unit),
  outputSchema: {
    additionalProperties: false,
    properties: {
      unit: { enum: Object.keys(lengthUnits), type: "string" },
      value: { type: "number" },
    },
    required: ["value", "unit"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "value",
        label: "Length",
        required: true,
        type: quantityLengthType,
        valueType: { format: "length", type: "number" },
      },
      {
        id: "fromUnit",
        label: "From unit",
        required: true,
        type: textPlainType,
        valueType: { format: "length-unit", type: "string" },
      },
      {
        id: "toUnit",
        label: "To unit",
        required: true,
        type: textPlainType,
        valueType: { format: "length-unit", type: "string" },
      },
    ],
    outputs: [
      {
        id: "value",
        label: "Converted length",
        path: ["value"],
        type: quantityLengthType,
        valueType: { format: "length", type: "number" },
      },
    ],
  },
  title: "Convert Length",
});

export default lengthConversionTool;
