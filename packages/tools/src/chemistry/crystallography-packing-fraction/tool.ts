import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type PackingFractionInput = {
  readonly atomicRadiusAngstrom: number;
  readonly atomsPerUnitCell: number;
  readonly unitCellVolumeAngstrom3: number;
};

export type PackingFractionOutput = {
  readonly packingFraction: number;
};

export const packingFractionExample = {
  input: {
    atomicRadiusAngstrom: 1,
    atomsPerUnitCell: 1,
    unitCellVolumeAngstrom3: 8,
  },
  output: {
    packingFraction: Math.PI / 6,
  },
} satisfies ToolExample<PackingFractionInput, PackingFractionOutput>;

export const packingFractionInputSchema = {
  additionalProperties: false,
  properties: {
    atomicRadiusAngstrom: {
      description: "Hard-sphere atomic radius in angstroms.",
      exclusiveMinimum: 0,
      type: "number",
    },
    atomsPerUnitCell: {
      description: "Number of atoms represented by one unit cell.",
      exclusiveMinimum: 0,
      type: "integer",
    },
    unitCellVolumeAngstrom3: {
      description: "Unit-cell volume in cubic angstroms.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: [
    "atomicRadiusAngstrom",
    "atomsPerUnitCell",
    "unitCellVolumeAngstrom3",
  ],
  type: "object",
} as const;

export const packingFractionOutputSchema = {
  additionalProperties: false,
  properties: {
    packingFraction: {
      description: "Fraction of unit-cell volume occupied by atoms.",
      exclusiveMinimum: 0,
      maximum: 1,
      type: "number",
    },
  },
  required: ["packingFraction"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const positiveFiniteIssue = (
  field: "atomicRadiusAngstrom" | "unitCellVolumeAngstrom3",
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
        field: "atomsPerUnitCell",
        message: "atomsPerUnitCell must be a positive safe integer.",
      };

export const calculatePackingFraction = (
  input: unknown,
): ToolResult<PackingFractionOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    positiveFiniteIssue("atomicRadiusAngstrom", input.atomicRadiusAngstrom),
    positiveSafeIntegerIssue(input.atomsPerUnitCell),
    positiveFiniteIssue(
      "unitCellVolumeAngstrom3",
      input.unitCellVolumeAngstrom3,
    ),
    ...Object.keys(input)
      .filter(
        (field) =>
          field !== "atomicRadiusAngstrom" &&
          field !== "atomsPerUnitCell" &&
          field !== "unitCellVolumeAngstrom3",
      )
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const packingFraction =
    ((input.atomsPerUnitCell as number) *
      (4 / 3) *
      Math.PI *
      (input.atomicRadiusAngstrom as number) ** 3) /
    (input.unitCellVolumeAngstrom3 as number);

  if (!Number.isFinite(packingFraction) || packingFraction <= 0)
    return invalidInput([
      {
        code: "invalid_output",
        field: "packingFraction",
        message:
          "Packing fraction could not be calculated as a finite positive number.",
      },
    ]);
  if (packingFraction > 1)
    return invalidInput([
      {
        code: "packing_fraction_out_of_range",
        field: "packingFraction",
        message: "Packing fraction must not exceed one.",
      },
    ]);

  return toolSuccess({ packingFraction });
};

export const packingFractionTool = defineTool<
  PackingFractionInput,
  PackingFractionOutput
>({
  contractVersion: 1,
  description:
    "Calculate the hard-sphere packing fraction of a unit cell from atomic radius, atom count, and unit-cell volume.",
  discovery: {
    aliases: ["atomic packing factor", "unit-cell packing fraction"],
    collections: ["chemistry", "crystallography"],
    fields: ["crystal structure", "packing", "unit cell"],
    keywords: ["atomic radius", "atoms per unit cell", "hard sphere"],
  },
  execute: calculatePackingFraction,
  execution: { kind: "pure" },
  id: "chemistry/crystallography-packing-fraction",
  inputSchema: packingFractionInputSchema,
  outputSchema: packingFractionOutputSchema,
  ports: {
    inputs: [
      {
        id: "atomicRadiusAngstrom",
        label: "Atomic radius",
        required: true,
        valueType: { format: "length", type: "number", unit: "Å" },
      },
      {
        id: "atomsPerUnitCell",
        label: "Atoms per unit cell",
        required: true,
        valueType: {
          format: "atoms-per-unit-cell",
          type: "integer",
        },
      },
      {
        id: "unitCellVolumeAngstrom3",
        label: "Unit-cell volume",
        required: true,
        valueType: {
          format: "volume",
          type: "number",
          unit: "Å^3",
        },
      },
    ],
    outputs: [
      {
        id: "packingFraction",
        label: "Packing fraction",
        valueType: { format: "fraction", type: "number" },
      },
    ],
  },
  title: "Packing Fraction Calculator",
});

export default packingFractionTool;
