import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type DensityFromUnitCellInput = {
  readonly formulaUnitsPerCell: number;
  readonly molarMassGPerMol: number;
  readonly unitCellVolumeAngstrom3: number;
};

export type DensityFromUnitCellOutput = {
  readonly densityGPerCm3: number;
};

const AVOGADRO_CONSTANT_PER_MOL = 6.022_140_76e23;
const ANGSTROM_CUBED_TO_CM_CUBED = 1e-24;

export const densityFromUnitCellExample = {
  input: {
    formulaUnitsPerCell: 4,
    molarMassGPerMol: 58.44,
    unitCellVolumeAngstrom3: 179.4,
  },
  output: {
    densityGPerCm3: 2.1636990654546175,
  },
} satisfies ToolExample<DensityFromUnitCellInput, DensityFromUnitCellOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const positiveFiniteIssue = (
  field: "molarMassGPerMol" | "unitCellVolumeAngstrom3",
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
        field: "formulaUnitsPerCell",
        message: "formulaUnitsPerCell must be a positive safe integer.",
      };

export const calculateDensityFromUnitCell = (
  input: unknown,
): ToolResult<DensityFromUnitCellOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    positiveSafeIntegerIssue(input.formulaUnitsPerCell),
    positiveFiniteIssue("molarMassGPerMol", input.molarMassGPerMol),
    positiveFiniteIssue(
      "unitCellVolumeAngstrom3",
      input.unitCellVolumeAngstrom3,
    ),
    ...Object.keys(input)
      .filter(
        (field) =>
          field !== "formulaUnitsPerCell" &&
          field !== "molarMassGPerMol" &&
          field !== "unitCellVolumeAngstrom3",
      )
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const densityGPerCm3 =
    ((input.formulaUnitsPerCell as number) *
      (input.molarMassGPerMol as number)) /
    (AVOGADRO_CONSTANT_PER_MOL *
      (input.unitCellVolumeAngstrom3 as number) *
      ANGSTROM_CUBED_TO_CM_CUBED);

  if (!Number.isFinite(densityGPerCm3) || densityGPerCm3 <= 0)
    return invalidInput([
      {
        code: "invalid_output",
        field: "densityGPerCm3",
        message: "Density could not be calculated as a finite positive number.",
      },
    ]);

  return toolSuccess({ densityGPerCm3 });
};

export const densityFromUnitCellInputSchema = {
  additionalProperties: false,
  properties: {
    formulaUnitsPerCell: {
      description: "Number of formula units Z in the unit cell.",
      exclusiveMinimum: 0,
      type: "integer",
    },
    molarMassGPerMol: {
      description: "Molar mass of one formula unit.",
      exclusiveMinimum: 0,
      type: "number",
    },
    unitCellVolumeAngstrom3: {
      description: "Unit-cell volume in cubic angstroms.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: [
    "formulaUnitsPerCell",
    "molarMassGPerMol",
    "unitCellVolumeAngstrom3",
  ],
  type: "object",
} as const;

export const densityFromUnitCellOutputSchema = {
  additionalProperties: false,
  properties: {
    densityGPerCm3: {
      description: "Calculated crystal density in grams per cubic centimetre.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["densityGPerCm3"],
  type: "object",
} as const;

export const densityFromUnitCellTool = defineTool<
  DensityFromUnitCellInput,
  DensityFromUnitCellOutput
>({
  contractVersion: 1,
  description:
    "Calculate crystal density from formula-unit molar mass, formula units per cell, and unit-cell volume.",
  discovery: {
    aliases: ["crystal density", "unit-cell density"],
    collections: ["chemistry", "crystallography"],
    fields: ["density", "solid state", "unit cell"],
    keywords: ["Z", "molar mass", "crystal density"],
  },
  execute: calculateDensityFromUnitCell,
  execution: { kind: "pure" },
  id: "chemistry/crystallography-density-from-unit-cell",
  inputSchema: densityFromUnitCellInputSchema,
  outputSchema: densityFromUnitCellOutputSchema,
  ports: {
    inputs: [
      {
        id: "formulaUnitsPerCell",
        label: "Formula units per cell",
        required: true,
        valueType: {
          format: "formula-units-per-cell",
          type: "integer",
        },
      },
      {
        id: "molarMassGPerMol",
        label: "Molar mass",
        required: true,
        valueType: {
          format: "molar-mass",
          type: "number",
          unit: "g/mol",
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
        id: "densityGPerCm3",
        label: "Crystal density",
        valueType: {
          format: "density",
          type: "number",
          unit: "g/cm3",
        },
      },
    ],
  },
  title: "Density From Unit Cell Calculator",
});

export default densityFromUnitCellTool;
