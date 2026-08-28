import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type RydbergWavelengthInput = {
  readonly atomicNumber: number;
  readonly lowerQuantumNumber: number;
  readonly upperQuantumNumber: number;
};

export type RydbergWavelengthOutput = {
  readonly wavelengthM: number;
};

const RYDBERG_CONSTANT_M_INV = 1.097_373_156_816_0e7;

export const rydbergWavelengthExample = {
  input: {
    atomicNumber: 1,
    lowerQuantumNumber: 2,
    upperQuantumNumber: 3,
  },
  output: {
    wavelengthM: 1 / (RYDBERG_CONSTANT_M_INV * (1 / 2 ** 2 - 1 / 3 ** 2)),
  },
} satisfies ToolExample<RydbergWavelengthInput, RydbergWavelengthOutput>;

export const rydbergWavelengthInputSchema = {
  additionalProperties: false,
  properties: {
    atomicNumber: {
      description: "Atomic number Z of the hydrogen-like species.",
      exclusiveMinimum: 0,
      type: "integer",
    },
    lowerQuantumNumber: {
      description: "Lower principal quantum number of the transition.",
      exclusiveMinimum: 0,
      type: "integer",
    },
    upperQuantumNumber: {
      description: "Upper principal quantum number of the transition.",
      exclusiveMinimum: 0,
      type: "integer",
    },
  },
  required: ["atomicNumber", "lowerQuantumNumber", "upperQuantumNumber"],
  type: "object",
} as const;

export const rydbergWavelengthOutputSchema = {
  additionalProperties: false,
  properties: {
    wavelengthM: {
      description: "Photon wavelength in metres.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["wavelengthM"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const positiveSafeIntegerIssue = (
  field: "atomicNumber" | "lowerQuantumNumber" | "upperQuantumNumber",
  value: unknown,
): ToolIssue | undefined =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0
    ? undefined
    : {
        code: "positive_safe_integer_required",
        field,
        message: `${field} must be a positive safe integer.`,
      };

export const calculateRydbergWavelength = (
  input: unknown,
): ToolResult<RydbergWavelengthOutput> => {
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
    positiveSafeIntegerIssue("lowerQuantumNumber", input.lowerQuantumNumber),
    positiveSafeIntegerIssue("upperQuantumNumber", input.upperQuantumNumber),
    ...Object.keys(input)
      .filter(
        (field) =>
          field !== "atomicNumber" &&
          field !== "lowerQuantumNumber" &&
          field !== "upperQuantumNumber",
      )
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const atomicNumber = input.atomicNumber as number;
  const lowerQuantumNumber = input.lowerQuantumNumber as number;
  const upperQuantumNumber = input.upperQuantumNumber as number;
  if (upperQuantumNumber <= lowerQuantumNumber)
    return invalidInput([
      {
        code: "quantum_number_order_invalid",
        field: "upperQuantumNumber",
        message: "upperQuantumNumber must be greater than lowerQuantumNumber.",
      },
    ]);

  const inverseWavelength =
    RYDBERG_CONSTANT_M_INV *
    atomicNumber ** 2 *
    (1 / lowerQuantumNumber ** 2 - 1 / upperQuantumNumber ** 2);
  const wavelengthM = 1 / inverseWavelength;
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

export const rydbergWavelengthTool = defineTool<
  RydbergWavelengthInput,
  RydbergWavelengthOutput
>({
  contractVersion: 1,
  description:
    "Calculate the wavelength of a hydrogen-like electronic transition using the Rydberg formula.",
  discovery: {
    aliases: ["Rydberg wavelength", "hydrogen spectrum wavelength"],
    collections: ["chemistry", "quantum mechanics"],
    fields: ["atomic spectra", "electronic transitions", "wavelength"],
    keywords: ["Rydberg", "hydrogen-like atom", "principal quantum number"],
  },
  execute: calculateRydbergWavelength,
  execution: { kind: "pure" },
  id: "chemistry/quantum-rydberg-wavelength",
  inputSchema: rydbergWavelengthInputSchema,
  outputSchema: rydbergWavelengthOutputSchema,
  ports: {
    inputs: [
      {
        id: "atomicNumber",
        label: "Atomic number",
        required: true,
        valueType: { format: "atomic-number", type: "integer" },
      },
      {
        id: "lowerQuantumNumber",
        label: "Lower quantum number",
        required: true,
        valueType: { format: "quantum-number", type: "integer" },
      },
      {
        id: "upperQuantumNumber",
        label: "Upper quantum number",
        required: true,
        valueType: { format: "quantum-number", type: "integer" },
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
  title: "Rydberg Wavelength Calculator",
});

export default rydbergWavelengthTool;
