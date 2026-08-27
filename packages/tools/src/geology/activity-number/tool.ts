import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ActivityNumberInput = {
  readonly plasticityIndexPercent: number;
  readonly clayFractionPercent: number;
};

export type ActivityNumberOutput = {
  readonly activity: number;
};

export const calculateActivityNumber = (
  input: ActivityNumberInput,
): ActivityNumberOutput => {
  if (!(input.plasticityIndexPercent > 0))
    simpleError(
      "plasticityIndexPercent",
      "Plasticity index must be greater than zero.",
      "invalid_index",
    );
  if (!(input.clayFractionPercent > 0))
    simpleError(
      "clayFractionPercent",
      "Clay fraction must be greater than zero.",
      "invalid_clay_fraction",
    );
  return { activity: input.plasticityIndexPercent / input.clayFractionPercent };
};

export const activityNumberExample = {
  input: { plasticityIndexPercent: 22, clayFractionPercent: 30 },
  output: { activity: 0.7333333333333333 },
} satisfies ToolExample<ActivityNumberInput, ActivityNumberOutput>;

export const activityNumberTool = createSimpleTool({
  id: "geology/activity-number",
  title: "Activity Number Calculator",
  description:
    "Compute the Skempton activity A as plasticity index divided by the clay fraction finer than two micrometers, both in percent.",
  inputs: [
    {
      description: "Plasticity index in percent.",
      id: "plasticityIndexPercent",
      kind: "number",
      label: "PI",
    },
    {
      description:
        "Clay fraction (finer than 0.002 mm) in percent of dry mass.",
      id: "clayFractionPercent",
      kind: "number",
      label: "Clay",
    },
  ],
  outputs: [
    {
      description: "Activity number (dimensionless).",
      id: "activity",
      kind: "number",
      label: "A",
    },
  ],
  calculate: (input) =>
    calculateActivityNumber(input as unknown as ActivityNumberInput),
});

export const runActivityNumber = activityNumberTool.execute;
export default activityNumberTool;
