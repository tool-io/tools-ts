import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type BohrRadiusInput = {
  readonly atomicNumber: number;
  readonly quantumNumber: number;
};

export type BohrRadiusOutput = {
  readonly radiusM: number;
};

const BOHR_RADIUS_M = 5.291_772_109_03e-11;

export const bohrRadiusExample = {
  input: { atomicNumber: 1, quantumNumber: 1 },
  output: { radiusM: BOHR_RADIUS_M },
} satisfies ToolExample<BohrRadiusInput, BohrRadiusOutput>;

export const bohrRadiusInputSchema = {
  additionalProperties: false,
  properties: {
    atomicNumber: {
      description: "Atomic number Z of the hydrogen-like species.",
      exclusiveMinimum: 0,
      type: "integer",
    },
    quantumNumber: {
      description: "Positive principal quantum number n.",
      exclusiveMinimum: 0,
      type: "integer",
    },
  },
  required: ["atomicNumber", "quantumNumber"],
  type: "object",
} as const;

export const bohrRadiusOutputSchema = {
  additionalProperties: false,
  properties: {
    radiusM: {
      description: "Bohr-orbit radius in metres.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["radiusM"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const positiveSafeIntegerIssue = (
  field: "atomicNumber" | "quantumNumber",
  value: unknown,
): ToolIssue | undefined =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0
    ? undefined
    : {
        code: "positive_safe_integer_required",
        field,
        message: `${field} must be a positive safe integer.`,
      };

export const calculateBohrRadius = (
  input: unknown,
): ToolResult<BohrRadiusOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    positiveSafeIntegerIssue("atomicNumber", input.atomicNumber),
    positiveSafeIntegerIssue("quantumNumber", input.quantumNumber),
    ...Object.keys(input)
      .filter((field) => field !== "atomicNumber" && field !== "quantumNumber")
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const radiusM =
    (BOHR_RADIUS_M * (input.quantumNumber as number) ** 2) /
    (input.atomicNumber as number);
  if (!Number.isFinite(radiusM) || radiusM <= 0)
    return invalidInput([
      {
        code: "invalid_output",
        field: "radiusM",
        message: "Radius could not be calculated as a finite positive number.",
      },
    ]);

  return toolSuccess({ radiusM });
};

export const bohrRadiusTool = defineTool<BohrRadiusInput, BohrRadiusOutput>({
  contractVersion: 1,
  description:
    "Calculate the Bohr-model radius of a hydrogen-like atom or ion at a specified principal quantum number.",
  discovery: {
    aliases: ["Bohr orbit radius", "hydrogen-like orbital radius"],
    collections: ["chemistry", "quantum mechanics"],
    fields: ["atomic structure", "Bohr model", "orbital radius"],
    keywords: ["Bohr radius", "atomic number", "quantum number"],
  },
  execute: calculateBohrRadius,
  execution: { kind: "pure" },
  id: "chemistry/quantum-bohr-radius",
  inputSchema: bohrRadiusInputSchema,
  outputSchema: bohrRadiusOutputSchema,
  ports: {
    inputs: [
      {
        id: "atomicNumber",
        label: "Atomic number",
        required: true,
        valueType: { format: "atomic-number", type: "integer" },
      },
      {
        id: "quantumNumber",
        label: "Quantum number",
        required: true,
        valueType: { format: "quantum-number", type: "integer" },
      },
    ],
    outputs: [
      {
        id: "radiusM",
        label: "Bohr radius",
        valueType: { format: "length", type: "number", unit: "m" },
      },
    ],
  },
  title: "Bohr Radius Calculator",
});

export default bohrRadiusTool;
