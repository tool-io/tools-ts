import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InductorPeakCurrentInput = {
  readonly loadCurrentA: number;
  readonly rippleCurrentA: number;
};

export type InductorPeakCurrentOutput = {
  readonly peakCurrentA: number;
};

export const inductorPeakCurrentExample = {
  input: { loadCurrentA: 2, rippleCurrentA: 0.6 },
  output: { peakCurrentA: 2.3 },
} satisfies ToolExample<InductorPeakCurrentInput, InductorPeakCurrentOutput>;

export const inductorPeakCurrentTool = createSimpleTool({
  calculate: (input) => {
    const loadCurrentA = input.loadCurrentA as number;
    const rippleCurrentA = input.rippleCurrentA as number;
    if (!(loadCurrentA > 0))
      simpleError(
        "loadCurrentA",
        "Load current must be positive.",
        "invalid_current",
      );
    if (!(rippleCurrentA > 0))
      simpleError(
        "rippleCurrentA",
        "Ripple current must be positive.",
        "invalid_current",
      );
    return {
      peakCurrentA: loadCurrentA + rippleCurrentA / 2,
    };
  },
  description:
    "Compute peak inductor current as the load current plus half of the inductor ripple current.",
  id: "electronics/inductor-peak-current",
  inputs: [
    { id: "loadCurrentA", kind: "number", label: "Load current", unit: "A" },
    {
      id: "rippleCurrentA",
      kind: "number",
      label: "Ripple current",
      unit: "A",
    },
  ],
  outputs: [
    { id: "peakCurrentA", kind: "number", label: "Peak current", unit: "A" },
  ],
  title: "Peak Inductor Current",
});
export const runInductorPeakCurrent = inductorPeakCurrentTool.execute;
export default inductorPeakCurrentTool;
