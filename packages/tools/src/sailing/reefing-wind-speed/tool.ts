import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReefingWindSpeedInput = {
  readonly designWindKt: number;
  readonly reefFactorPercent: number;
};

export type ReefingWindSpeedOutput = {
  readonly reefWindKt: number;
};

export const reefingWindSpeedExample = {
  input: { designWindKt: 25, reefFactorPercent: 30 },
  output: { reefWindKt: 7.5 },
} satisfies ToolExample<ReefingWindSpeedInput, ReefingWindSpeedOutput>;

export const reefingWindSpeedTool = createSimpleTool({
  calculate: (input) => {
    const designWindKt = input.designWindKt as number;
    if (designWindKt <= 0)
      simpleError(
        "designWindKt",
        "Design wind speed must be positive.",
        "invalid_input",
      );
    const reefFactorPercent = input.reefFactorPercent as number;
    return { reefWindKt: (designWindKt * reefFactorPercent) / 100 };
  },
  description:
    "Calculate the apparent wind speed at which to reef using reefWindKt = designWindKt * reefFactorPercent / 100.",
  id: "sailing/reefing-wind-speed",
  inputs: [
    {
      description:
        "Design or comfortable upwind apparent wind speed of the boat.",
      id: "designWindKt",
      kind: "number",
      label: "Design wind speed",
      unit: "kt",
    },
    {
      default: 30,
      description:
        "Percentage of the design wind speed at which the reef is taken.",
      id: "reefFactorPercent",
      kind: "number",
      label: "Reef factor",
      maximum: 100,
      minimum: 10,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Apparent wind speed threshold for reefing.",
      id: "reefWindKt",
      kind: "number",
      label: "Reefing wind speed",
      unit: "kt",
    },
  ],
  title: "Reefing Wind Speed Calculator",
});
export const runReefingWindSpeed = reefingWindSpeedTool.execute;
export default reefingWindSpeedTool;
