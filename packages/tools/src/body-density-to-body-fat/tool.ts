import { defineTool } from "../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../core/result.js";

export type BodyDensityToBodyFatInput = {
  readonly densityGPerCm3: number;
  readonly equation?: "brozek" | "siri";
};

export type BodyDensityToBodyFatOutput = {
  readonly bodyFatPercent: number;
  readonly densityGPerCm3: number;
  readonly equation: "brozek" | "siri";
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const calculateBodyDensityToBodyFat = (
  input: unknown,
): ToolResult<BodyDensityToBodyFatOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  if (
    typeof input.densityGPerCm3 !== "number" ||
    !Number.isFinite(input.densityGPerCm3) ||
    input.densityGPerCm3 <= 0
  )
    return invalidInput([
      {
        code: "positive_finite_number_required",
        field: "densityGPerCm3",
        message: "densityGPerCm3 must be a finite number greater than zero.",
      },
    ]);
  if (
    input.equation !== undefined &&
    input.equation !== "brozek" &&
    input.equation !== "siri"
  )
    return invalidInput([
      {
        code: "supported_equation_required",
        field: "equation",
        message: "equation must be siri or brozek.",
      },
    ]);
  const unknownFields = Object.keys(input).filter(
    (field) => field !== "densityGPerCm3" && field !== "equation",
  );
  if (unknownFields.length > 0)
    return invalidInput(
      unknownFields.map((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
    );

  const densityGPerCm3 = input.densityGPerCm3;
  const equation = (input.equation ?? "siri") as "brozek" | "siri";
  const bodyFatPercent =
    equation === "siri"
      ? 495 / densityGPerCm3 - 450
      : 457 / densityGPerCm3 - 414.2;
  return toolSuccess({ bodyFatPercent, densityGPerCm3, equation });
};

export const bodyDensityToBodyFatTool = defineTool<
  BodyDensityToBodyFatInput,
  BodyDensityToBodyFatOutput
>({
  contractVersion: 1,
  description:
    "Convert a measured whole-body density to an estimated body-fat percentage with the Siri or Brozek equation.",
  discovery: {
    aliases: ["body density conversion", "Siri body fat", "Brozek body fat"],
    collections: ["data", "learn"],
    fields: ["body composition", "health"],
    keywords: ["body density", "body fat", "Brozek", "Siri"],
  },
  execute: calculateBodyDensityToBodyFat,
  execution: { kind: "pure" },
  id: "body-density-to-body-fat",
  inputSchema: {
    additionalProperties: false,
    properties: {
      densityGPerCm3: { exclusiveMinimum: 0, type: "number" },
      equation: { enum: ["brozek", "siri"], type: "string" },
    },
    required: ["densityGPerCm3"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      bodyFatPercent: { type: "number" },
      densityGPerCm3: { exclusiveMinimum: 0, type: "number" },
      equation: { enum: ["brozek", "siri"], type: "string" },
    },
    required: ["bodyFatPercent", "densityGPerCm3", "equation"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "densityGPerCm3",
        label: "Measured body density",
        required: true,
        valueType: { format: "body-density", type: "number", unit: "g/cm3" },
      },
      {
        id: "equation",
        label: "Conversion equation",
        required: false,
        valueType: { format: "body-fat-equation", type: "string" },
      },
    ],
    outputs: [
      {
        id: "bodyFatPercent",
        label: "Estimated body fat",
        valueType: { format: "percentage", type: "number", unit: "%" },
      },
    ],
  },
  title: "Body Density to Body Fat Calculator",
});

export default bodyDensityToBodyFatTool;
