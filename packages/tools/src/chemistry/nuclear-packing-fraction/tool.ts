import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type NuclearPackingFractionInput = {
  readonly atomicMassU: number;
  readonly massNumber: number;
};

export type NuclearPackingFractionOutput = {
  readonly packingFractionPerTenThousand: number;
};

export const nuclearPackingFractionExample = {
  input: { atomicMassU: 4.002603, massNumber: 4 },
  output: { packingFractionPerTenThousand: ((4.002603 - 4) / 4) * 10_000 },
} satisfies ToolExample<
  NuclearPackingFractionInput,
  NuclearPackingFractionOutput
>;

export const nuclearPackingFractionInputSchema = {
  additionalProperties: false,
  properties: {
    atomicMassU: {
      description: "Isotopic atomic mass in unified atomic mass units.",
      exclusiveMinimum: 0,
      type: "number",
    },
    massNumber: {
      description: "Mass number A of the nuclide.",
      exclusiveMinimum: 0,
      type: "integer",
    },
  },
  required: ["atomicMassU", "massNumber"],
  type: "object",
} as const;

export const nuclearPackingFractionOutputSchema = {
  additionalProperties: false,
  properties: {
    packingFractionPerTenThousand: {
      description:
        "Packing fraction (atomic mass minus mass number, divided by mass number), expressed in parts per ten thousand.",
      type: "number",
    },
  },
  required: ["packingFractionPerTenThousand"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const positiveFiniteIssue = (value: unknown): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? undefined
    : {
        code: "positive_finite_number_required",
        field: "atomicMassU",
        message: "atomicMassU must be a finite number greater than zero.",
      };

const positiveSafeIntegerIssue = (value: unknown): ToolIssue | undefined =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0
    ? undefined
    : {
        code: "positive_safe_integer_required",
        field: "massNumber",
        message: "massNumber must be a positive safe integer.",
      };

export const calculateNuclearPackingFraction = (
  input: unknown,
): ToolResult<NuclearPackingFractionOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    positiveFiniteIssue(input.atomicMassU),
    positiveSafeIntegerIssue(input.massNumber),
    ...Object.keys(input)
      .filter((field) => field !== "atomicMassU" && field !== "massNumber")
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const massNumber = input.massNumber as number;
  const packingFractionPerTenThousand =
    (((input.atomicMassU as number) - massNumber) / massNumber) * 10_000;
  if (!Number.isFinite(packingFractionPerTenThousand))
    return invalidInput([
      {
        code: "invalid_output",
        field: "packingFractionPerTenThousand",
        message: "Packing fraction could not be calculated as a finite number.",
      },
    ]);

  return toolSuccess({ packingFractionPerTenThousand });
};

export const nuclearPackingFractionTool = defineTool<
  NuclearPackingFractionInput,
  NuclearPackingFractionOutput
>({
  contractVersion: 1,
  description:
    "Calculate the conventional nuclear packing fraction from isotopic atomic mass and mass number, reported in parts per ten thousand.",
  discovery: {
    aliases: ["nuclear packing fraction", "nuclide packing fraction"],
    collections: ["chemistry", "nuclear physics"],
    fields: ["nuclear masses", "nuclide stability", "packing fraction"],
    keywords: ["atomic mass", "mass number", "packing fraction", "10^-4"],
  },
  execute: calculateNuclearPackingFraction,
  execution: { kind: "pure" },
  id: "chemistry/nuclear-packing-fraction",
  inputSchema: nuclearPackingFractionInputSchema,
  outputSchema: nuclearPackingFractionOutputSchema,
  ports: {
    inputs: [
      {
        id: "atomicMassU",
        label: "Atomic mass",
        required: true,
        valueType: { format: "atomic-mass", type: "number", unit: "u" },
      },
      {
        id: "massNumber",
        label: "Mass number",
        required: true,
        valueType: { format: "mass-number", type: "integer" },
      },
    ],
    outputs: [
      {
        id: "packingFractionPerTenThousand",
        label: "Packing fraction",
        valueType: {
          format: "nuclear-packing-fraction",
          type: "number",
          unit: "10^-4",
        },
      },
    ],
  },
  title: "Nuclear Packing Fraction Calculator",
});

export default nuclearPackingFractionTool;
