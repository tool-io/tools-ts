import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type KineticEnergyInput = {
  readonly massKg: number;
  readonly speedMs: number;
};

export type KineticEnergyOutput = {
  readonly joules: number;
};

export const kineticEnergyInputSchema = {
  additionalProperties: false,
  properties: {
    massKg: {
      description: "Mass in kilograms.",
      exclusiveMinimum: 0,
      type: "number",
    },
    speedMs: {
      description: "Speed in meters per second.",
      minimum: 0,
      type: "number",
    },
  },
  required: ["massKg", "speedMs"],
  type: "object",
} as const;

export const kineticEnergyOutputSchema = {
  additionalProperties: false,
  properties: {
    joules: {
      description: "Kinetic energy in joules.",
      minimum: 0,
      type: "number",
    },
  },
  required: ["joules"],
  type: "object",
} as const;

export const kineticEnergyExample = {
  input: { massKg: 2, speedMs: 3 },
  output: { joules: 9 },
} satisfies ToolExample<KineticEnergyInput, KineticEnergyOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isKineticEnergyOutput = (
  value: unknown,
): value is KineticEnergyOutput =>
  isRecord(value) &&
  typeof value.joules === "number" &&
  Number.isFinite(value.joules);

export const calculateKineticEnergy = (
  input: unknown,
): ToolResult<KineticEnergyOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (field !== "massKg" && field !== "speedMs")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  for (const [field, code, allowZero] of [
    ["massKg", "mass_kg", false],
    ["speedMs", "speed_ms", true],
  ] as const)
    if (input[field] === undefined)
      issues.push({
        code: `${code}_required`,
        field,
        message: `${field} is required.`,
      });
    else if (
      typeof input[field] !== "number" ||
      !Number.isFinite(input[field]) ||
      (allowZero
        ? (input[field] as number) < 0
        : (input[field] as number) <= 0)
    )
      issues.push({
        code: `${code}_invalid`,
        field,
        message: `${field} must be a finite ${allowZero ? "nonnegative" : "positive"} number.`,
      });

  if (issues.length > 0) return invalidInput(issues);

  const massKg = input.massKg as number;
  const speedMs = input.speedMs as number;
  return toolSuccess({ joules: (massKg * speedMs * speedMs) / 2 });
};

export const kineticEnergyTool = defineTool<
  KineticEnergyInput,
  KineticEnergyOutput
>({
  contractVersion: 1,
  description:
    "Compute translational kinetic energy as one half mass times speed squared.",
  discovery: {
    aliases: ["ke-calculator"],
    keywords: ["energy", "kinetic", "motion", "physics"],
  },
  execute: calculateKineticEnergy,
  execution: { kind: "pure" },
  id: "physics/kinetic-energy",
  inputSchema: kineticEnergyInputSchema,
  outputSchema: kineticEnergyOutputSchema,
  ports: {
    inputs: [
      {
        description: "Mass in kilograms.",
        id: "massKg",
        label: "Mass",
        required: true,
        valueType: { format: "mass", type: "number", unit: "kg" },
      },
      {
        description: "Speed in meters per second.",
        id: "speedMs",
        label: "Speed",
        required: true,
        valueType: { format: "velocity", type: "number", unit: "m/s" },
      },
    ],
    outputs: [
      {
        description: "Kinetic energy in joules.",
        id: "joules",
        label: "Energy",
        valueType: { format: "energy", type: "number", unit: "J" },
      },
    ],
  },
  title: "Kinetic Energy",
});

export const runKineticEnergy = kineticEnergyTool.execute;
export default kineticEnergyTool;
