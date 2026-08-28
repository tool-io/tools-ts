import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type DeBroglieWavelengthInput = {
  readonly massKg: number;
  readonly speedMs: number;
};

export type DeBroglieWavelengthOutput = {
  readonly wavelengthM: number;
};

const PLANCK_CONSTANT_J_S = 6.626_070_15e-34;

export const deBroglieWavelengthExample = {
  input: { massKg: 1, speedMs: 2 },
  output: { wavelengthM: 3.313_035_075e-34 },
} satisfies ToolExample<DeBroglieWavelengthInput, DeBroglieWavelengthOutput>;

export const deBroglieWavelengthInputSchema = {
  additionalProperties: false,
  properties: {
    massKg: {
      description: "Particle mass in kilograms.",
      exclusiveMinimum: 0,
      type: "number",
    },
    speedMs: {
      description: "Particle speed in metres per second.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["massKg", "speedMs"],
  type: "object",
} as const;

export const deBroglieWavelengthOutputSchema = {
  additionalProperties: false,
  properties: {
    wavelengthM: {
      description: "Nonrelativistic de Broglie wavelength in metres.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["wavelengthM"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const positiveFiniteIssue = (
  field: "massKg" | "speedMs",
  value: unknown,
): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? undefined
    : {
        code: "positive_finite_number_required",
        field,
        message: `${field} must be a finite number greater than zero.`,
      };

export const calculateDeBroglieWavelength = (
  input: unknown,
): ToolResult<DeBroglieWavelengthOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    positiveFiniteIssue("massKg", input.massKg),
    positiveFiniteIssue("speedMs", input.speedMs),
    ...Object.keys(input)
      .filter((field) => field !== "massKg" && field !== "speedMs")
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const wavelengthM =
    PLANCK_CONSTANT_J_S /
    ((input.massKg as number) * (input.speedMs as number));
  if (!Number.isFinite(wavelengthM) || wavelengthM <= 0)
    return invalidInput([
      {
        code: "invalid_output",
        field: "wavelengthM",
        message:
          "Wavelength could not be calculated as a finite positive number.",
      },
    ]);

  return toolSuccess({ wavelengthM });
};

export const deBroglieWavelengthTool = defineTool<
  DeBroglieWavelengthInput,
  DeBroglieWavelengthOutput
>({
  contractVersion: 1,
  description:
    "Calculate the nonrelativistic de Broglie wavelength from particle mass and speed.",
  discovery: {
    aliases: ["matter-wave wavelength", "de Broglie equation"],
    collections: ["chemistry", "quantum mechanics"],
    fields: ["matter waves", "quantum physics", "wavelength"],
    keywords: ["de Broglie", "h over mv", "matter wave"],
  },
  execute: calculateDeBroglieWavelength,
  execution: { kind: "pure" },
  id: "chemistry/quantum-de-broglie-wavelength",
  inputSchema: deBroglieWavelengthInputSchema,
  outputSchema: deBroglieWavelengthOutputSchema,
  ports: {
    inputs: [
      {
        id: "massKg",
        label: "Mass",
        required: true,
        valueType: { format: "mass", type: "number", unit: "kg" },
      },
      {
        id: "speedMs",
        label: "Speed",
        required: true,
        valueType: { format: "velocity", type: "number", unit: "m/s" },
      },
    ],
    outputs: [
      {
        id: "wavelengthM",
        label: "Wavelength",
        valueType: { format: "wavelength", type: "number", unit: "m" },
      },
    ],
  },
  title: "De Broglie Wavelength Calculator",
});

export default deBroglieWavelengthTool;
