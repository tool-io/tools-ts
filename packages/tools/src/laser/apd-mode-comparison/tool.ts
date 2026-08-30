import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly geigerDetectionEfficiencyPercent: number;
  readonly linearDetectionEfficiencyPercent: number;
}>;
export type Output = Readonly<{
  readonly efficiencyRatio: number;
  readonly efficiencyDifferencePoints: number;
  readonly higherEfficiencyMode: string;
}>;

export const calculate = (input: Input): Output => {
  const efficiencyRatio =
    input.linearDetectionEfficiencyPercent === 0
      ? 0
      : input.geigerDetectionEfficiencyPercent /
        input.linearDetectionEfficiencyPercent;
  return {
    efficiencyRatio,
    efficiencyDifferencePoints:
      input.geigerDetectionEfficiencyPercent -
      input.linearDetectionEfficiencyPercent,
    higherEfficiencyMode:
      input.geigerDetectionEfficiencyPercent ===
      input.linearDetectionEfficiencyPercent
        ? "tie"
        : input.geigerDetectionEfficiencyPercent >
            input.linearDetectionEfficiencyPercent
          ? "geiger"
          : "linear",
  };
};

export const exampleInput = {
  geigerDetectionEfficiencyPercent: 60,
  linearDetectionEfficiencyPercent: 20,
} satisfies Input;
export const exampleOutput = {
  efficiencyRatio: 3,
  efficiencyDifferencePoints: 40,
  higherEfficiencyMode: "geiger",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      geigerDetectionEfficiencyPercent:
        input.geigerDetectionEfficiencyPercent as number,
      linearDetectionEfficiencyPercent:
        input.linearDetectionEfficiencyPercent as number,
    }),
  description:
    "Compare caller-supplied Geiger- and linear-mode APD detection efficiencies.",
  id: "laser/apd-mode-comparison",
  inputs: [
    {
      id: "geigerDetectionEfficiencyPercent",
      label: "Geiger-mode detection efficiency",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "linearDetectionEfficiencyPercent",
      label: "Linear-mode detection efficiency",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "efficiencyRatio",
      label: "Geiger-to-linear efficiency ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "efficiencyDifferencePoints",
      label: "Efficiency difference",
      kind: "number",
      unit: "percentage points",
    },
    {
      id: "higherEfficiencyMode",
      label: "Higher-efficiency mode",
      kind: "string",
      enum: ["geiger", "linear", "tie"],
    },
  ],
  title: "APD Mode Comparison",
});

export const run = tool.execute;
export default tool;
