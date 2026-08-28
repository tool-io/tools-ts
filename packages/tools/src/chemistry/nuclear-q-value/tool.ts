import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type NuclearQValueInput = {
  readonly finalMassKg: number;
  readonly initialMassKg: number;
};

export type NuclearQValueOutput = {
  readonly qValueJ: number;
};

const SPEED_OF_LIGHT_M_S = 299_792_458;

export const nuclearQValueExample = {
  input: { finalMassKg: 0.5, initialMassKg: 1 },
  output: { qValueJ: 0.5 * SPEED_OF_LIGHT_M_S ** 2 },
} satisfies ToolExample<NuclearQValueInput, NuclearQValueOutput>;

export const nuclearQValueInputSchema = {
  additionalProperties: false,
  properties: {
    finalMassKg: {
      description: "Final-state mass in kilograms.",
      exclusiveMinimum: 0,
      type: "number",
    },
    initialMassKg: {
      description: "Initial-state mass in kilograms.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["finalMassKg", "initialMassKg"],
  type: "object",
} as const;

export const nuclearQValueOutputSchema = {
  additionalProperties: false,
  properties: {
    qValueJ: {
      description: "Mass-energy difference of the reaction in joules.",
      type: "number",
    },
  },
  required: ["qValueJ"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const positiveFiniteIssue = (
  field: "finalMassKg" | "initialMassKg",
  value: unknown,
): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? undefined
    : {
        code: "positive_finite_number_required",
        field,
        message: `${field} must be a finite number greater than zero.`,
      };

export const calculateNuclearQValue = (
  input: unknown,
): ToolResult<NuclearQValueOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    positiveFiniteIssue("finalMassKg", input.finalMassKg),
    positiveFiniteIssue("initialMassKg", input.initialMassKg),
    ...Object.keys(input)
      .filter((field) => field !== "finalMassKg" && field !== "initialMassKg")
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const qValueJ =
    ((input.initialMassKg as number) - (input.finalMassKg as number)) *
    SPEED_OF_LIGHT_M_S ** 2;
  if (!Number.isFinite(qValueJ))
    return invalidInput([
      {
        code: "invalid_output",
        field: "qValueJ",
        message: "Q value could not be calculated as a finite number.",
      },
    ]);

  return toolSuccess({ qValueJ });
};

export const nuclearQValueTool = defineTool<
  NuclearQValueInput,
  NuclearQValueOutput
>({
  contractVersion: 1,
  description:
    "Calculate a nuclear reaction Q value from the initial and final masses using mass-energy equivalence.",
  discovery: {
    aliases: ["nuclear reaction Q value", "mass defect energy"],
    collections: ["chemistry", "nuclear physics"],
    fields: ["mass-energy equivalence", "nuclear reactions", "Q value"],
    keywords: ["E=mc2", "initial mass", "final mass", "reaction energy"],
  },
  execute: calculateNuclearQValue,
  execution: { kind: "pure" },
  id: "chemistry/nuclear-q-value",
  inputSchema: nuclearQValueInputSchema,
  outputSchema: nuclearQValueOutputSchema,
  ports: {
    inputs: [
      {
        id: "finalMassKg",
        label: "Final mass",
        required: true,
        valueType: { format: "mass", type: "number", unit: "kg" },
      },
      {
        id: "initialMassKg",
        label: "Initial mass",
        required: true,
        valueType: { format: "mass", type: "number", unit: "kg" },
      },
    ],
    outputs: [
      {
        id: "qValueJ",
        label: "Q value",
        valueType: { format: "energy", type: "number", unit: "J" },
      },
    ],
  },
  title: "Nuclear Q-Value Calculator",
});

export default nuclearQValueTool;
