import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type NeutronSeparationEnergyInput = {
  readonly daughterMassKg: number;
  readonly parentMassKg: number;
};

export type NeutronSeparationEnergyOutput = {
  readonly separationEnergyJ: number;
};

const NEUTRON_MASS_KG = 1.674_927_498_04e-27;
const SPEED_OF_LIGHT_M_S = 299_792_458;

export const neutronSeparationEnergyExample = {
  input: { daughterMassKg: 0.5e-27, parentMassKg: 2e-27 },
  output: {
    separationEnergyJ:
      (0.5e-27 + NEUTRON_MASS_KG - 2e-27) * SPEED_OF_LIGHT_M_S ** 2,
  },
} satisfies ToolExample<
  NeutronSeparationEnergyInput,
  NeutronSeparationEnergyOutput
>;

export const neutronSeparationEnergyInputSchema = {
  additionalProperties: false,
  properties: {
    daughterMassKg: {
      description: "Mass of the daughter nucleus in kilograms.",
      exclusiveMinimum: 0,
      type: "number",
    },
    parentMassKg: {
      description: "Mass of the parent nucleus in kilograms.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["daughterMassKg", "parentMassKg"],
  type: "object",
} as const;

export const neutronSeparationEnergyOutputSchema = {
  additionalProperties: false,
  properties: {
    separationEnergyJ: {
      description:
        "Energy required to remove one neutron from the parent nucleus, in joules.",
      type: "number",
    },
  },
  required: ["separationEnergyJ"],
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

export const calculateNeutronSeparationEnergy = (
  input: unknown,
): ToolResult<NeutronSeparationEnergyOutput> => {
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

  const separationEnergyJ =
    ((input.daughterMassKg as number) +
      NEUTRON_MASS_KG -
      (input.parentMassKg as number)) *
    SPEED_OF_LIGHT_M_S ** 2;
  if (!Number.isFinite(separationEnergyJ))
    return invalidInput([
      {
        code: "invalid_output",
        field: "separationEnergyJ",
        message:
          "Separation energy could not be calculated as a finite number.",
      },
    ]);

  return toolSuccess({ separationEnergyJ });
};

export const neutronSeparationEnergyTool = defineTool<
  NeutronSeparationEnergyInput,
  NeutronSeparationEnergyOutput
>({
  contractVersion: 1,
  description:
    "Calculate one-neutron separation energy from parent and daughter nuclear masses.",
  discovery: {
    aliases: ["neutron separation energy", "one-neutron binding energy"],
    collections: ["chemistry", "nuclear physics"],
    fields: ["nuclear masses", "separation energy", "nuclear stability"],
    keywords: ["neutron mass", "parent nucleus", "daughter nucleus"],
  },
  execute: calculateNeutronSeparationEnergy,
  execution: { kind: "pure" },
  id: "chemistry/nuclear-neutron-separation-energy",
  inputSchema: neutronSeparationEnergyInputSchema,
  outputSchema: neutronSeparationEnergyOutputSchema,
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
        id: "separationEnergyJ",
        label: "Neutron separation energy",
        valueType: { format: "energy", type: "number", unit: "J" },
      },
    ],
  },
  title: "Neutron Separation Energy Calculator",
});

export default neutronSeparationEnergyTool;
