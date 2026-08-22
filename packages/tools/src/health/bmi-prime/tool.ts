import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type BmiPrimeInput = {
  readonly heightM: number;
  readonly weightKg: number;
};

export type BmiPrimeOutput = {
  readonly bmi: number;
  readonly bmiPrime: number;
};

export const bmiPrimeExample = {
  input: {
    heightM: 1.8,
    weightKg: 70,
  },
  output: {
    bmi: 21.604938271604937,
    bmiPrime: 0.8641975308641975,
  },
} satisfies ToolExample<BmiPrimeInput, BmiPrimeOutput>;

export const bmiPrimeInputSchema = {
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

export const bmiPrimeOutputSchema = {
  additionalProperties: false,
  properties: {
    bmi: {
      description: "Body mass index in kilograms per square metre.",
      exclusiveMinimum: 0,
      type: "number",
    },
    bmiPrime: {
      description: "Body mass index prime, the ratio of body mass index to 25.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["bmiPrime", "bmi"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isBmiPrimeOutput = (value: unknown): value is BmiPrimeOutput =>
  isRecord(value) &&
  typeof value.bmi === "number" &&
  Number.isFinite(value.bmi) &&
  value.bmi > 0 &&
  typeof value.bmiPrime === "number" &&
  Number.isFinite(value.bmiPrime) &&
  value.bmiPrime > 0;

const positiveFiniteIssue = (
  field: keyof BmiPrimeInput,
  value: unknown,
): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? undefined
    : {
        code: "positive_finite_number_required",
        field,
        message: `${field} must be a finite number greater than zero.`,
      };

export const calculateBmiPrime = (
  input: unknown,
): ToolResult<BmiPrimeOutput> => {
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
  const bmi = weightKg / (heightM * heightM);
  return toolSuccess({
    bmi,
    bmiPrime: bmi / 25,
  });
};

export const bmiPrimeTool = defineTool<BmiPrimeInput, BmiPrimeOutput>({
  contractVersion: 1,
  description:
    "Calculate BMI prime as body mass index divided by the upper healthy limit of 25.",
  execute: calculateBmiPrime,
  execution: { kind: "pure" },
  id: "health/bmi-prime",
  inputSchema: bmiPrimeInputSchema,
  outputSchema: bmiPrimeOutputSchema,
  ports: {
    inputs: [
      {
        id: "weightKg",
        label: "Weight",
        required: true,
        valueType: { format: "mass", type: "number", unit: "kg" },
      },
      {
        id: "heightM",
        label: "Height",
        required: true,
        valueType: { format: "length", type: "number", unit: "m" },
      },
    ],
    outputs: [
      {
        id: "bmiPrime",
        label: "BMI prime",
        valueType: { format: "body-mass-index", type: "number" },
      },
      {
        id: "bmi",
        label: "Body mass index",
        valueType: { format: "body-mass-index", type: "number" },
      },
    ],
  },
  title: "BMI Prime Calculator",
});

export const runBmiPrime = bmiPrimeTool.execute;
export default bmiPrimeTool;
