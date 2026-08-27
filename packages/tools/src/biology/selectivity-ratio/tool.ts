import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const selectivityRatioExample = {
  input: { offTargetIc50: 500, onTargetIc50: 25 },
  output: { selectivityRatio: 20 },
} satisfies ToolExample<
  { readonly offTargetIc50: number; readonly onTargetIc50: number },
  { readonly selectivityRatio: number }
>;

export const selectivityRatioTool = createSimpleTool({
  id: "biology/selectivity-ratio",
  title: "Selectivity Ratio",
  description:
    "Quantify drug selectivity as the off-target IC50 divided by the on-target IC50, where larger values indicate a more selective compound.",
  inputs: [
    {
      description:
        "IC50 against the intended target, in nanomolar; must be greater than zero.",
      id: "onTargetIc50",
      label: "On-target IC50",
      kind: "number",
      unit: "nM",
    },
    {
      description:
        "IC50 against the off-target, in nanomolar; must be greater than zero.",
      id: "offTargetIc50",
      label: "Off-target IC50",
      kind: "number",
      unit: "nM",
    },
  ],
  outputs: [
    {
      description: "Off-target IC50 divided by on-target IC50.",
      id: "selectivityRatio",
      label: "Selectivity ratio",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const onTargetIc50 = input.onTargetIc50 as number;
    const offTargetIc50 = input.offTargetIc50 as number;
    if (!(onTargetIc50 > 0))
      simpleError(
        "onTargetIc50",
        "The on-target IC50 must be greater than zero.",
        "invalid_on_target",
      );
    if (!(offTargetIc50 > 0))
      simpleError(
        "offTargetIc50",
        "The off-target IC50 must be greater than zero.",
        "invalid_off_target",
      );
    return { selectivityRatio: offTargetIc50 / onTargetIc50 };
  },
});
export const runSelectivityRatio = selectivityRatioTool.execute;
export default selectivityRatioTool;
