import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MaritalStatusDistributionPercentInput = {
  readonly single: number;
  readonly married: number;
  readonly widowed: number;
  readonly divorced: number;
};

export type MaritalStatusDistributionPercentOutput = {
  readonly singlePercent: number;
  readonly marriedPercent: number;
  readonly widowedPercent: number;
  readonly divorcedPercent: number;
};

export const calculateMaritalStatusDistributionPercent = (
  input: MaritalStatusDistributionPercentInput,
): MaritalStatusDistributionPercentOutput => {
  for (const key of ["single", "married", "widowed", "divorced"] as const)
    if (!(input[key] >= 0))
      return simpleError(key, "Counts must be non-negative.", "invalid_count");
  const total = input.single + input.married + input.widowed + input.divorced;
  if (!(total > 0))
    return simpleError(
      "single",
      "The combined population must be positive.",
      "invalid_count",
    );
  return {
    singlePercent: (100 * input.single) / total,
    marriedPercent: (100 * input.married) / total,
    widowedPercent: (100 * input.widowed) / total,
    divorcedPercent: (100 * input.divorced) / total,
  };
};

export const maritalStatusDistributionPercentExample = {
  input: { single: 350, married: 500, widowed: 60, divorced: 90 },
  output: {
    singlePercent: 35,
    marriedPercent: 50,
    widowedPercent: 6,
    divorcedPercent: 9,
  },
} satisfies ToolExample<
  MaritalStatusDistributionPercentInput,
  MaritalStatusDistributionPercentOutput
>;

export const maritalStatusDistributionPercentTool = createSimpleTool({
  id: "demography/marital-status-distribution-percent",
  title: "Marital Status Distribution Calculator",
  description:
    "Compute the percentage distribution of a population across single, married, widowed and divorced marital statuses.",
  inputs: [
    {
      description: "Never-married persons.",
      id: "single",
      kind: "number",
      label: "Single",
      minimum: 0,
    },
    {
      description: "Currently married persons.",
      id: "married",
      kind: "number",
      label: "Married",
      minimum: 0,
    },
    {
      description: "Widowed persons.",
      id: "widowed",
      kind: "number",
      label: "Widowed",
      minimum: 0,
    },
    {
      description: "Divorced persons.",
      id: "divorced",
      kind: "number",
      label: "Divorced",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Single share in percent.",
      id: "singlePercent",
      kind: "number",
      label: "Single %",
    },
    {
      description: "Married share in percent.",
      id: "marriedPercent",
      kind: "number",
      label: "Married %",
    },
    {
      description: "Widowed share in percent.",
      id: "widowedPercent",
      kind: "number",
      label: "Widowed %",
    },
    {
      description: "Divorced share in percent.",
      id: "divorcedPercent",
      kind: "number",
      label: "Divorced %",
    },
  ],
  calculate: (input) =>
    calculateMaritalStatusDistributionPercent(
      input as unknown as MaritalStatusDistributionPercentInput,
    ),
});

export const runMaritalStatusDistributionPercent =
  maritalStatusDistributionPercentTool.execute;
export default maritalStatusDistributionPercentTool;
