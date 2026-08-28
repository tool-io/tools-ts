import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type AlphaDecayEnergyInput = {
  readonly daughterMassKg: number;
  readonly parentMassKg: number;
};

export type AlphaDecayEnergyOutput = {
  readonly qValueJ: number;
};

const ALPHA_PARTICLE_MASS_KG = 6.644_657_345_0e-27;
const SPEED_OF_LIGHT_M_S = 299_792_458;

export const alphaDecayEnergyExample = {
  input: { daughterMassKg: 1e-26, parentMassKg: 2e-26 },
  output: {
    qValueJ: (2e-26 - 1e-26 - ALPHA_PARTICLE_MASS_KG) * SPEED_OF_LIGHT_M_S ** 2,
  },
} satisfies ToolExample<AlphaDecayEnergyInput, AlphaDecayEnergyOutput>;

export const alphaDecayEnergyInputSchema = {
  additionalProperties: false,
  properties: {
    daughterMassKg: {
      description: "Daughter-nucleus mass in kilograms.",
      exclusiveMinimum: 0,
      type: "number",
    },
    parentMassKg: {
      description: "Parent-nucleus mass in kilograms.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["daughterMassKg", "parentMassKg"],
  type: "object",
} as const;

export const alphaDecayEnergyOutputSchema = {
  additionalProperties: false,
  properties: {
    qValueJ: {
      description: "Alpha-decay energy release in joules.",
      type: "number",
    },
  },
  required: ["qValueJ"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const positiveFiniteIssue = (
  field: "daughterMassKg" | "parentMassKg",
  value: unknown,
): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? undefined
    : {
        code: "positive_finite_number_required",
        field,
        message: `${field} must be a finite number greater than zero.`,
      };

export const calculateAlphaDecayEnergy = (
  input: unknown,
): ToolResult<AlphaDecayEnergyOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    positiveFiniteIssue("daughterMassKg", input.daughterMassKg),
    positiveFiniteIssue("parentMassKg", input.parentMassKg),
    ...Object.keys(input)
      .filter((field) => field !== "daughterMassKg" && field !== "parentMassKg")
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const qValueJ =
    ((input.parentMassKg as number) -
      (input.daughterMassKg as number) -
      ALPHA_PARTICLE_MASS_KG) *
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

export const alphaDecayEnergyTool = defineTool<
  AlphaDecayEnergyInput,
  AlphaDecayEnergyOutput
>({
  contractVersion: 1,
  description:
    "Calculate the Q value of alpha decay from parent and daughter nuclear masses.",
  discovery: {
    aliases: ["alpha decay Q value", "alpha decay energy"],
    collections: ["chemistry", "nuclear physics"],
    fields: ["alpha decay", "nuclear masses", "Q value"],
    keywords: ["alpha particle", "parent nucleus", "daughter nucleus"],
  },
  execute: calculateAlphaDecayEnergy,
  execution: { kind: "pure" },
  id: "chemistry/nuclear-alpha-decay-energy",
  inputSchema: alphaDecayEnergyInputSchema,
  outputSchema: alphaDecayEnergyOutputSchema,
  ports: {
    inputs: [
      {
        id: "daughterMassKg",
        label: "Daughter mass",
        required: true,
        valueType: { format: "mass", type: "number", unit: "kg" },
      },
      {
        id: "parentMassKg",
        label: "Parent mass",
        required: true,
        valueType: { format: "mass", type: "number", unit: "kg" },
      },
    ],
    outputs: [
      {
        id: "qValueJ",
        label: "Alpha-decay Q value",
        valueType: { format: "energy", type: "number", unit: "J" },
      },
    ],
  },
  title: "Alpha Decay Energy Calculator",
});

export default alphaDecayEnergyTool;
