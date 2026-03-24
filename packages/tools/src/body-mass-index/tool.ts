import { defineTool } from "../core/definition.js";
import {
  indexBodyMassType,
  quantityLengthMetersType,
  quantityMassKilogramsType,
} from "../core/semantic-type.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../core/result.js";

export type BodyMassIndexInput = {
  readonly heightM: number;
  readonly weightKg: number;
};

export type BodyMassIndexOutput = {
  readonly bmi: number;
};

export const bodyMassIndexInputSchema = {
  additionalProperties: false,
  properties: {
    heightM: {
      description: "Height in metres.",
      exclusiveMinimum: 0,
      type: "number",
    },
    weightKg: {
      description: "Weight in kilograms.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["weightKg", "heightM"],
  type: "object",
} as const;

export const bodyMassIndexOutputSchema = {
  additionalProperties: false,
  properties: {
    bmi: {
      description: "Body mass index in kilograms per square metre.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["bmi"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isBodyMassIndexOutput = (
  value: unknown,
): value is BodyMassIndexOutput =>
  isRecord(value) &&
  typeof value.bmi === "number" &&
  Number.isFinite(value.bmi) &&
  value.bmi > 0;

const positiveFiniteIssue = (
  field: keyof BodyMassIndexInput,
  value: unknown,
): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? undefined
    : {
        code: "positive_finite_number_required",
        field,
        message: `${field} must be a finite number greater than zero.`,
      };

export const calculateBodyMassIndex = (
  input: unknown,
): ToolResult<BodyMassIndexOutput> => {
  if (!isRecord(input)) {
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  }

  const issues = [
    positiveFiniteIssue("weightKg", input.weightKg),
    positiveFiniteIssue("heightM", input.heightM),
    ...Object.keys(input)
      .filter((field) => field !== "heightM" && field !== "weightKg")
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const weightKg = input.weightKg as number;
  const heightM = input.heightM as number;
  return toolSuccess({
    bmi: weightKg / (heightM * heightM),
  });
};

export const bodyMassIndexTool = defineTool<
  BodyMassIndexInput,
  BodyMassIndexOutput
>({
  contractVersion: 1,
  description:
    "Calculate body mass index from weight in kilograms and height in metres.",
  execute: calculateBodyMassIndex,
  executionKind: "pure",
  id: "body-mass-index",
  inputSchema: bodyMassIndexInputSchema,
  isOutput: isBodyMassIndexOutput,
  outputSchema: bodyMassIndexOutputSchema,
  ports: {
    inputs: [
      {
        id: "weightKg",
        label: "Weight",
        required: true,
        type: quantityMassKilogramsType,
      },
      {
        id: "heightM",
        label: "Height",
        required: true,
        type: quantityLengthMetersType,
      },
    ],
    outputs: [
      {
        id: "bmi",
        label: "Body mass index",
        type: indexBodyMassType,
      },
    ],
  },
  title: "Body Mass Index",
});
