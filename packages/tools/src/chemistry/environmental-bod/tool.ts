import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type BodInput = {
  readonly dilutionFactor: number;
  readonly finalDissolvedOxygenMgPerL: number;
  readonly initialDissolvedOxygenMgPerL: number;
};

export type BodOutput = {
  readonly bodMgPerL: number;
};

export const bodExample = {
  input: {
    dilutionFactor: 1,
    finalDissolvedOxygenMgPerL: 3,
    initialDissolvedOxygenMgPerL: 8,
  },
  output: { bodMgPerL: 5 },
} satisfies ToolExample<BodInput, BodOutput>;

export const bodInputSchema = {
  additionalProperties: false,
  properties: {
    dilutionFactor: {
      description: "Dimensionless dilution factor applied to oxygen depletion.",
      exclusiveMinimum: 0,
      type: "number",
    },
    finalDissolvedOxygenMgPerL: {
      description: "Dissolved oxygen after incubation, in mg/L.",
      minimum: 0,
      type: "number",
    },
    initialDissolvedOxygenMgPerL: {
      description: "Dissolved oxygen before incubation, in mg/L.",
      minimum: 0,
      type: "number",
    },
  },
  required: [
    "dilutionFactor",
    "finalDissolvedOxygenMgPerL",
    "initialDissolvedOxygenMgPerL",
  ],
  type: "object",
} as const;

export const bodOutputSchema = {
  additionalProperties: false,
  properties: {
    bodMgPerL: {
      description: "Biochemical oxygen demand in mg/L.",
      minimum: 0,
      type: "number",
    },
  },
  required: ["bodMgPerL"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonnegativeFiniteIssue = (
  field: "finalDissolvedOxygenMgPerL" | "initialDissolvedOxygenMgPerL",
  value: unknown,
): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
    ? undefined
    : {
        code: "nonnegative_finite_number_required",
        field,
        message: `${field} must be a finite number greater than or equal to zero.`,
      };

const positiveFiniteIssue = (value: unknown): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? undefined
    : {
        code: "positive_finite_number_required",
        field: "dilutionFactor",
        message: "dilutionFactor must be a finite number greater than zero.",
      };

export const calculateBod = (input: unknown): ToolResult<BodOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    positiveFiniteIssue(input.dilutionFactor),
    nonnegativeFiniteIssue(
      "finalDissolvedOxygenMgPerL",
      input.finalDissolvedOxygenMgPerL,
    ),
    nonnegativeFiniteIssue(
      "initialDissolvedOxygenMgPerL",
      input.initialDissolvedOxygenMgPerL,
    ),
    ...Object.keys(input)
      .filter(
        (field) =>
          field !== "dilutionFactor" &&
          field !== "finalDissolvedOxygenMgPerL" &&
          field !== "initialDissolvedOxygenMgPerL",
      )
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const initial = input.initialDissolvedOxygenMgPerL as number;
  const final = input.finalDissolvedOxygenMgPerL as number;
  if (final > initial)
    return invalidInput([
      {
        code: "final_oxygen_exceeds_initial",
        field: "finalDissolvedOxygenMgPerL",
        message:
          "finalDissolvedOxygenMgPerL cannot exceed initialDissolvedOxygenMgPerL.",
      },
    ]);

  const bodMgPerL = (initial - final) * (input.dilutionFactor as number);
  if (!Number.isFinite(bodMgPerL) || bodMgPerL < 0)
    return invalidInput([
      {
        code: "invalid_output",
        field: "bodMgPerL",
        message: "BOD could not be calculated as a finite nonnegative number.",
      },
    ]);

  return toolSuccess({ bodMgPerL });
};

export const bodTool = defineTool<BodInput, BodOutput>({
  contractVersion: 1,
  description:
    "Calculate biochemical oxygen demand from dissolved-oxygen depletion and a dilution factor.",
  discovery: {
    aliases: ["biochemical oxygen demand", "BOD"],
    collections: ["chemistry", "environmental chemistry"],
    fields: ["dissolved oxygen", "water quality", "oxygen demand"],
    keywords: ["BOD", "incubation", "dilution factor", "DO depletion"],
  },
  execute: calculateBod,
  execution: { kind: "pure" },
  id: "chemistry/environmental-bod",
  inputSchema: bodInputSchema,
  outputSchema: bodOutputSchema,
  ports: {
    inputs: [
      {
        id: "dilutionFactor",
        label: "Dilution factor",
        required: true,
        valueType: { format: "dilution-factor", type: "number" },
      },
      {
        id: "finalDissolvedOxygenMgPerL",
        label: "Final dissolved oxygen",
        required: true,
        valueType: { format: "concentration", type: "number", unit: "mg/L" },
      },
      {
        id: "initialDissolvedOxygenMgPerL",
        label: "Initial dissolved oxygen",
        required: true,
        valueType: { format: "concentration", type: "number", unit: "mg/L" },
      },
    ],
    outputs: [
      {
        id: "bodMgPerL",
        label: "Biochemical oxygen demand",
        valueType: { format: "concentration", type: "number", unit: "mg/L" },
      },
    ],
  },
  title: "BOD Calculator",
});

export default bodTool;
