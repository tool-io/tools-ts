import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InductorRmsCurrentInput = {
  readonly loadCurrentAmps: number;
  readonly rippleCurrentAmps: number;
};

export type InductorRmsCurrentOutput = {
  readonly rmsCurrentA: number;
};

export const inductorRmsCurrentExample = {
  input: { loadCurrentAmps: 2, rippleCurrentAmps: 0.6 },
  output: { rmsCurrentA: 2.0074859899884734 },
} satisfies ToolExample<InductorRmsCurrentInput, InductorRmsCurrentOutput>;

export const inductorRmsCurrentTool = createSimpleTool({
  calculate: (input) => {
    const loadCurrentAmps = input.loadCurrentAmps as number;
    const rippleCurrentAmps = input.rippleCurrentAmps as number;
    if (!(loadCurrentAmps > 0))
      simpleError(
        "loadCurrentAmps",
        "Load current must be positive.",
        "invalid_current",
      );
    if (!(rippleCurrentAmps > 0))
      simpleError(
        "rippleCurrentAmps",
        "Ripple current must be positive.",
        "invalid_current",
      );
    return {
      rmsCurrentA: Math.sqrt(
        loadCurrentAmps ** 2 + Math.pow(rippleCurrentAmps, 2) / 12,
      ),
    };
  },
  description:
    "Compute RMS inductor current as sqrt(I_load^2 + I_ripple^2 / 12) for a triangular ripple waveform.",
  id: "electronics/inductor-rms-current",
  inputs: [
    { id: "loadCurrentAmps", kind: "number", label: "Load current", unit: "A" },
    {
      id: "rippleCurrentAmps",
      kind: "number",
      label: "Ripple current",
      unit: "A",
    },
  ],
  outputs: [
    { id: "rmsCurrentA", kind: "number", label: "RMS current", unit: "A" },
  ],
  title: "RMS Inductor Current",
});
export const runInductorRmsCurrent = inductorRmsCurrentTool.execute;
export default inductorRmsCurrentTool;
