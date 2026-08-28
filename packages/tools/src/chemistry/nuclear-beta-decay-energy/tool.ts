import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type BetaDecayMode = "beta-minus" | "beta-plus";

export type BetaDecayEnergyInput = {
  readonly decayMode: BetaDecayMode;
  readonly daughterAtomicMassKg: number;
  readonly parentAtomicMassKg: number;
};

export type BetaDecayEnergyOutput = {
  readonly qValueJ: number;
};

const ELECTRON_MASS_KG = 9.109_383_701_5e-31;
const SPEED_OF_LIGHT_M_S = 299_792_458;

export const betaDecayEnergyExample = {
  input: {
    decayMode: "beta-minus",
    daughterAtomicMassKg: 1.5,
    parentAtomicMassKg: 2,
  },
  output: { qValueJ: 0.5 * SPEED_OF_LIGHT_M_S ** 2 },
} satisfies ToolExample<BetaDecayEnergyInput, BetaDecayEnergyOutput>;

export const betaDecayEnergyInputSchema = {
  additionalProperties: false,
  properties: {
    decayMode: {
      description: "Beta-minus or beta-plus decay mode.",
      enum: ["beta-minus", "beta-plus"],
      type: "string",
    },
    daughterAtomicMassKg: {
      description: "Daughter-atom mass in kilograms.",
      exclusiveMinimum: 0,
      type: "number",
    },
    parentAtomicMassKg: {
      description: "Parent-atom mass in kilograms.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["decayMode", "daughterAtomicMassKg", "parentAtomicMassKg"],
  type: "object",
} as const;

export const betaDecayEnergyOutputSchema = {
  additionalProperties: false,
  properties: {
    qValueJ: {
      description: "Beta-decay energy release in joules.",
      type: "number",
    },
  },
  required: ["qValueJ"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const positiveFiniteIssue = (
  field: "daughterAtomicMassKg" | "parentAtomicMassKg",
  value: unknown,
): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? undefined
    : {
        code: "positive_finite_number_required",
        field,
        message: `${field} must be a finite number greater than zero.`,
      };

const decayModeIssue = (value: unknown): ToolIssue | undefined =>
  value === "beta-minus" || value === "beta-plus"
    ? undefined
    : {
        code: "supported_decay_mode_required",
        field: "decayMode",
        message: "decayMode must be beta-minus or beta-plus.",
      };

export const calculateBetaDecayEnergy = (
  input: unknown,
): ToolResult<BetaDecayEnergyOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    decayModeIssue(input.decayMode),
    positiveFiniteIssue("daughterAtomicMassKg", input.daughterAtomicMassKg),
    positiveFiniteIssue("parentAtomicMassKg", input.parentAtomicMassKg),
    ...Object.keys(input)
      .filter(
        (field) =>
          field !== "decayMode" &&
          field !== "daughterAtomicMassKg" &&
          field !== "parentAtomicMassKg",
      )
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const massDifference =
    (input.parentAtomicMassKg as number) -
    (input.daughterAtomicMassKg as number) -
    (input.decayMode === "beta-plus" ? 2 * ELECTRON_MASS_KG : 0);
  const qValueJ = massDifference * SPEED_OF_LIGHT_M_S ** 2;
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

export const betaDecayEnergyTool = defineTool<
  BetaDecayEnergyInput,
  BetaDecayEnergyOutput
>({
  contractVersion: 1,
  description:
    "Calculate beta-minus or beta-plus decay Q value from parent and daughter atomic masses.",
  discovery: {
    aliases: ["beta decay Q value", "beta decay energy"],
    collections: ["chemistry", "nuclear physics"],
    fields: ["beta decay", "nuclear masses", "Q value"],
    keywords: ["beta-minus", "beta-plus", "electron mass", "atomic mass"],
  },
  execute: calculateBetaDecayEnergy,
  execution: { kind: "pure" },
  id: "chemistry/nuclear-beta-decay-energy",
  inputSchema: betaDecayEnergyInputSchema,
  outputSchema: betaDecayEnergyOutputSchema,
  ports: {
    inputs: [
      {
        id: "decayMode",
        label: "Decay mode",
        required: true,
        valueType: { format: "beta-decay-mode", type: "string" },
      },
      {
        id: "daughterAtomicMassKg",
        label: "Daughter atomic mass",
        required: true,
        valueType: { format: "atomic-mass", type: "number", unit: "kg" },
      },
      {
        id: "parentAtomicMassKg",
        label: "Parent atomic mass",
        required: true,
        valueType: { format: "atomic-mass", type: "number", unit: "kg" },
      },
    ],
    outputs: [
      {
        id: "qValueJ",
        label: "Beta-decay Q value",
        valueType: { format: "energy", type: "number", unit: "J" },
      },
    ],
  },
  title: "Beta Decay Energy Calculator",
});

export default betaDecayEnergyTool;
