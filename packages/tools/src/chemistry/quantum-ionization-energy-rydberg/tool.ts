import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type IonizationEnergyRydbergInput = {
  readonly atomicNumber: number;
  readonly quantumNumber: number;
};

export type IonizationEnergyRydbergOutput = {
  readonly ionizationEnergyJ: number;
};

const PLANCK_CONSTANT_J_S = 6.626_070_15e-34;
const SPEED_OF_LIGHT_M_S = 299_792_458;
const RYDBERG_CONSTANT_M_INV = 1.097_373_156_816_0e7;

export const ionizationEnergyRydbergExample = {
  input: { atomicNumber: 1, quantumNumber: 1 },
  output: {
    ionizationEnergyJ:
      PLANCK_CONSTANT_J_S * SPEED_OF_LIGHT_M_S * RYDBERG_CONSTANT_M_INV,
  },
} satisfies ToolExample<
  IonizationEnergyRydbergInput,
  IonizationEnergyRydbergOutput
>;

export const ionizationEnergyRydbergInputSchema = {
  additionalProperties: false,
  properties: {
    atomicNumber: {
      description: "Atomic number Z of the hydrogen-like species.",
      exclusiveMinimum: 0,
      type: "integer",
    },
    quantumNumber: {
      description: "Principal quantum number n of the bound state.",
      exclusiveMinimum: 0,
      type: "integer",
    },
  },
  required: ["atomicNumber", "quantumNumber"],
  type: "object",
} as const;

export const ionizationEnergyRydbergOutputSchema = {
  additionalProperties: false,
  properties: {
    ionizationEnergyJ: {
      description: "Energy required to ionize from the level, in joules.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["ionizationEnergyJ"],
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

export const calculateIonizationEnergyRydberg = (
  input: unknown,
): ToolResult<IonizationEnergyRydbergOutput> => {
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

  const ionizationEnergyJ =
    (PLANCK_CONSTANT_J_S *
      SPEED_OF_LIGHT_M_S *
      RYDBERG_CONSTANT_M_INV *
      (input.atomicNumber as number) ** 2) /
    (input.quantumNumber as number) ** 2;
  if (!Number.isFinite(ionizationEnergyJ) || ionizationEnergyJ <= 0)
    return invalidInput([
      {
        code: "invalid_output",
        field: "ionizationEnergyJ",
        message:
          "Ionization energy could not be calculated as a finite positive number.",
      },
    ]);

  return toolSuccess({ ionizationEnergyJ });
};

export const ionizationEnergyRydbergTool = defineTool<
  IonizationEnergyRydbergInput,
  IonizationEnergyRydbergOutput
>({
  contractVersion: 1,
  description:
    "Calculate the hydrogen-like ionization energy from a principal quantum level using the Rydberg relation.",
  discovery: {
    aliases: ["Rydberg ionization energy", "hydrogen-like ionization energy"],
    collections: ["chemistry", "quantum mechanics"],
    fields: ["atomic structure", "ionization energy", "energy levels"],
    keywords: [
      "Rydberg energy",
      "ionization",
      "atomic number",
      "quantum number",
    ],
  },
  execute: calculateIonizationEnergyRydberg,
  execution: { kind: "pure" },
  id: "chemistry/quantum-ionization-energy-rydberg",
  inputSchema: ionizationEnergyRydbergInputSchema,
  outputSchema: ionizationEnergyRydbergOutputSchema,
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
        id: "ionizationEnergyJ",
        label: "Ionization energy",
        valueType: { format: "energy", type: "number", unit: "J" },
      },
    ],
  },
  title: "Ionization Energy Rydberg Calculator",
});

export default ionizationEnergyRydbergTool;
