import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type ParticleInBoxEnergyInput = {
  readonly boxLengthM: number;
  readonly massKg: number;
  readonly quantumNumber: number;
};

export type ParticleInBoxEnergyOutput = {
  readonly energyJ: number;
};

const PLANCK_CONSTANT_J_S = 6.626_070_15e-34;

export const particleInBoxEnergyExample = {
  input: {
    boxLengthM: 1,
    massKg: 1,
    quantumNumber: 1,
  },
  output: { energyJ: 5.488100704090127e-68 },
} satisfies ToolExample<ParticleInBoxEnergyInput, ParticleInBoxEnergyOutput>;

export const particleInBoxEnergyInputSchema = {
  additionalProperties: false,
  properties: {
    boxLengthM: {
      description: "Length of the one-dimensional box in metres.",
      exclusiveMinimum: 0,
      type: "number",
    },
    massKg: {
      description: "Particle mass in kilograms.",
      exclusiveMinimum: 0,
      type: "number",
    },
    quantumNumber: {
      description: "Positive integer energy-level quantum number n.",
      exclusiveMinimum: 0,
      type: "integer",
    },
  },
  required: ["boxLengthM", "massKg", "quantumNumber"],
  type: "object",
} as const;

export const particleInBoxEnergyOutputSchema = {
  additionalProperties: false,
  properties: {
    energyJ: {
      description: "Energy level in joules.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["energyJ"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const positiveFiniteIssue = (
  field: "boxLengthM" | "massKg",
  value: unknown,
): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? undefined
    : {
        code: "positive_finite_number_required",
        field,
        message: `${field} must be a finite number greater than zero.`,
      };

const positiveSafeIntegerIssue = (value: unknown): ToolIssue | undefined =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0
    ? undefined
    : {
        code: "positive_safe_integer_required",
        field: "quantumNumber",
        message: "quantumNumber must be a positive safe integer.",
      };

export const calculateParticleInBoxEnergy = (
  input: unknown,
): ToolResult<ParticleInBoxEnergyOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    positiveFiniteIssue("boxLengthM", input.boxLengthM),
    positiveFiniteIssue("massKg", input.massKg),
    positiveSafeIntegerIssue(input.quantumNumber),
    ...Object.keys(input)
      .filter(
        (field) =>
          field !== "boxLengthM" &&
          field !== "massKg" &&
          field !== "quantumNumber",
      )
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const energyJ =
    (PLANCK_CONSTANT_J_S ** 2 * (input.quantumNumber as number) ** 2) /
    (8 * (input.massKg as number) * (input.boxLengthM as number) ** 2);
  if (!Number.isFinite(energyJ) || energyJ <= 0)
    return invalidInput([
      {
        code: "invalid_output",
        field: "energyJ",
        message: "Energy could not be calculated as a finite positive number.",
      },
    ]);

  return toolSuccess({ energyJ });
};

export const particleInBoxEnergyTool = defineTool<
  ParticleInBoxEnergyInput,
  ParticleInBoxEnergyOutput
>({
  contractVersion: 1,
  description:
    "Calculate the energy of a quantum level for a particle in a one-dimensional infinite potential well.",
  discovery: {
    aliases: ["infinite square well energy", "particle in a box"],
    collections: ["chemistry", "quantum mechanics"],
    fields: ["energy levels", "quantum physics", "wave mechanics"],
    keywords: ["box length", "infinite well", "quantum number", "n squared"],
  },
  execute: calculateParticleInBoxEnergy,
  execution: { kind: "pure" },
  id: "chemistry/quantum-particle-in-box-energy",
  inputSchema: particleInBoxEnergyInputSchema,
  outputSchema: particleInBoxEnergyOutputSchema,
  ports: {
    inputs: [
      {
        id: "boxLengthM",
        label: "Box length",
        required: true,
        valueType: { format: "length", type: "number", unit: "m" },
      },
      {
        id: "massKg",
        label: "Particle mass",
        required: true,
        valueType: { format: "mass", type: "number", unit: "kg" },
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
        id: "energyJ",
        label: "Energy level",
        valueType: { format: "energy", type: "number", unit: "J" },
      },
    ],
  },
  title: "Particle in a Box Energy Calculator",
});

export default particleInBoxEnergyTool;
