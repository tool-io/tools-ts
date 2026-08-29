import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const dampingResponseSpectrumHeuristicScalingExample = {
  input: { dampingRatioPercent: 10 },
  output: {
    scalingFactor: 0.8408964152537145,
    note: "Power-law heuristic; code factors may differ for extreme damping.",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const dampingResponseSpectrumHeuristicScalingTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ dampingRatioPercent }) => {
      const zeta = dampingRatioPercent / 100;
      if (zeta <= 0)
        simpleError("dampingRatioPercent", "Damping must be positive.");
      return {
        scalingFactor: Math.pow(0.05 / zeta, 0.25),
        note: "Power-law heuristic; code factors may differ for extreme damping.",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Heuristic spectral scaling from 5% to another damping ratio: F = (0.05/ζ)^0.25.",
  id: "seismology/damping-response-spectrum-heuristic-scaling",
  inputs: [
    {
      minimum: 0,
      description: "Target damping.",
      id: "dampingRatioPercent",
      kind: "number",
      label: "ζ%",
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Multiplier relative to the 5% spectrum.",
      id: "scalingFactor",
      kind: "number",
      label: "F(ζ)",
    },
    {
      description: "Heuristic caveat.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  title: "Damping Response Spectrum Heuristic Scaling",
});
export const runDampingResponseSpectrumHeuristicScaling =
  dampingResponseSpectrumHeuristicScalingTool.execute;
export { dampingResponseSpectrumHeuristicScalingExample as example };
export default dampingResponseSpectrumHeuristicScalingTool;
