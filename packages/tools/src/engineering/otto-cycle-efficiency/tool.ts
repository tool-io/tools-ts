import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OttoCycleEfficiencyInput = Readonly<{
  readonly compressionRatio: number;
  readonly specificHeatRatio: number;
}>;
export type OttoCycleEfficiencyOutput = Readonly<{
  readonly efficiencyFraction: number;
}>;

export const calculateOttoCycleEfficiency = (
  x: OttoCycleEfficiencyInput,
): OttoCycleEfficiencyOutput => {
  if (!Number.isFinite(x.compressionRatio) || x.compressionRatio < 0)
    simpleError("compressionRatio", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.specificHeatRatio) || x.specificHeatRatio < 0)
    simpleError("specificHeatRatio", "Provide a finite number at least 0.");
  if (x.compressionRatio <= 1 || x.specificHeatRatio <= 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const efficiencyFraction =
    1 - 1 / x.compressionRatio ** (x.specificHeatRatio - 1);
  if (!Number.isFinite(efficiencyFraction))
    simpleError(
      "efficiencyFraction",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    efficiencyFraction: Object.is(efficiencyFraction, -0)
      ? 0
      : efficiencyFraction,
  };
};

export const example = {
  input: { compressionRatio: 10, specificHeatRatio: 1.4 },
  output: { efficiencyFraction: 0.6018928294465027 },
} satisfies ToolExample<OttoCycleEfficiencyInput, OttoCycleEfficiencyOutput>;

export const tool = createSimpleTool({
  id: "engineering/otto-cycle-efficiency",
  title: "Otto Cycle Efficiency",
  description:
    "Ideal air-standard Otto-cycle thermal efficiency 1−1/r^(γ−1) from compression ratio and constant heat-capacity ratio.",
  inputs: [
    {
      id: "compressionRatio",
      kind: "number",
      label: "Compression Ratio",
      minimum: 0,
    },
    {
      id: "specificHeatRatio",
      kind: "number",
      label: "Specific Heat Ratio",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "efficiencyFraction", kind: "number", label: "Efficiency Fraction" },
  ],
  calculate: (input) =>
    calculateOttoCycleEfficiency({
      compressionRatio: input.compressionRatio as number,
      specificHeatRatio: input.specificHeatRatio as number,
    }),
});
export const ottoCycleEfficiencyTool = tool;
export const runOttoCycleEfficiency = tool.execute;
export default tool;
