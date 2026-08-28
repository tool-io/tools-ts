import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type NuclearBindingEnergyTotalInput = {
  readonly massDefectKg: number;
};

export type NuclearBindingEnergyTotalOutput = {
  readonly bindingEnergyJ: number;
};

const SPEED_OF_LIGHT_M_S = 299_792_458;

export const nuclearBindingEnergyTotalExample = {
  input: { massDefectKg: 1e-27 },
  output: { bindingEnergyJ: 1e-27 * SPEED_OF_LIGHT_M_S ** 2 },
} satisfies ToolExample<
  NuclearBindingEnergyTotalInput,
  NuclearBindingEnergyTotalOutput
>;

export const nuclearBindingEnergyTotalInputSchema = {
  additionalProperties: false,
  properties: {
    massDefectKg: {
      description: "Mass defect of the nucleus in kilograms.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["massDefectKg"],
  type: "object",
} as const;

export const nuclearBindingEnergyTotalOutputSchema = {
  additionalProperties: false,
  properties: {
    bindingEnergyJ: {
      description: "Total nuclear binding energy in joules.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["bindingEnergyJ"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const positiveFiniteIssue = (value: unknown): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? undefined
    : {
        code: "positive_finite_number_required",
        field: "massDefectKg",
        message: "massDefectKg must be a finite number greater than zero.",
      };

export const calculateNuclearBindingEnergyTotal = (
  input: unknown,
): ToolResult<NuclearBindingEnergyTotalOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    positiveFiniteIssue(input.massDefectKg),
    ...Object.keys(input)
      .filter((field) => field !== "massDefectKg")
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const bindingEnergyJ =
    (input.massDefectKg as number) * SPEED_OF_LIGHT_M_S ** 2;
  if (!Number.isFinite(bindingEnergyJ) || bindingEnergyJ <= 0)
    return invalidInput([
      {
        code: "invalid_output",
        field: "bindingEnergyJ",
        message:
          "Binding energy could not be calculated as a finite positive number.",
      },
    ]);

  return toolSuccess({ bindingEnergyJ });
};

export const nuclearBindingEnergyTotalTool = defineTool<
  NuclearBindingEnergyTotalInput,
  NuclearBindingEnergyTotalOutput
>({
  contractVersion: 1,
  description:
    "Calculate total nuclear binding energy from a nucleus mass defect using E = mc².",
  discovery: {
    aliases: ["total nuclear binding energy", "mass defect binding energy"],
    collections: ["chemistry", "nuclear physics"],
    fields: ["binding energy", "mass defect", "nuclear stability"],
    keywords: ["E=mc2", "mass defect", "nuclear binding"],
  },
  execute: calculateNuclearBindingEnergyTotal,
  execution: { kind: "pure" },
  id: "chemistry/nuclear-binding-energy-total",
  inputSchema: nuclearBindingEnergyTotalInputSchema,
  outputSchema: nuclearBindingEnergyTotalOutputSchema,
  ports: {
    inputs: [
      {
        id: "massDefectKg",
        label: "Mass defect",
        required: true,
        valueType: { format: "mass", type: "number", unit: "kg" },
      },
    ],
    outputs: [
      {
        id: "bindingEnergyJ",
        label: "Binding energy",
        valueType: { format: "energy", type: "number", unit: "J" },
      },
    ],
  },
  title: "Total Nuclear Binding Energy Calculator",
});

export default nuclearBindingEnergyTotalTool;
