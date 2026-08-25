import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type DapNitrogenContributionInput = {
  readonly dapDoseMgPerL: number;
  readonly nitrogenContentPercent: number;
};

export type DapNitrogenContributionOutput = {
  readonly nitrogenContributionMgPerL: number;
};

export const dapNitrogenContributionExample = {
  input: {
    dapDoseMgPerL: 100,
    nitrogenContentPercent: 21,
  },
  output: {
    nitrogenContributionMgPerL: 21,
  },
} satisfies ToolExample<
  DapNitrogenContributionInput,
  DapNitrogenContributionOutput
>;

export const calculateDapNitrogenContribution = (
  input: DapNitrogenContributionInput,
): DapNitrogenContributionOutput => {
  const nitrogenFraction = input.nitrogenContentPercent / 100;
  if (nitrogenFraction <= 0)
    simpleError(
      "nitrogenContentPercent",
      "The nitrogen content must be positive.",
      "invalid_value",
    );
  return {
    nitrogenContributionMgPerL: roundStatistic(
      input.dapDoseMgPerL * nitrogenFraction,
    ),
  };
};

export const dapNitrogenContributionTool = createSimpleTool({
  calculate: (input) =>
    calculateDapNitrogenContribution(
      input as unknown as DapNitrogenContributionInput,
    ),
  description:
    "Convert a diammonium phosphate dose into its yeast assimilable nitrogen contribution.",
  id: "oenology/dap-nitrogen-contribution",
  inputs: [
    {
      description: "DAP added per liter of must.",
      id: "dapDoseMgPerL",
      kind: "number",
      label: "DAP dose",
      minimum: 0,
      unit: "mg/L",
    },
    {
      description:
        "Elemental nitrogen mass fraction stated for the DAP product.",
      id: "nitrogenContentPercent",
      kind: "number",
      label: "Nitrogen content",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "YAN supplied by the DAP addition.",
      id: "nitrogenContributionMgPerL",
      kind: "number",
      label: "Nitrogen contribution",
      unit: "mg/L",
    },
  ],
  title: "DAP Nitrogen Contribution Calculator",
});
export const runDapNitrogenContribution = dapNitrogenContributionTool.execute;
export default dapNitrogenContributionTool;
