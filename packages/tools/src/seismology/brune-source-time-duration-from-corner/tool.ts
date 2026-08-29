import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const bruneSourceTimeDurationFromCornerExample = {
  input: { cornerFrequencyHz: 1 },
  output: {
    sourceDurationSeconds: 0.15915494309189535,
    riseTimeSeconds: 0.07957747154594767,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const bruneSourceTimeDurationFromCornerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ cornerFrequencyHz }) => {
      if (!(cornerFrequencyHz > 0))
        simpleError("cornerFrequencyHz", "Corner frequency must be positive.");
      return {
        sourceDurationSeconds: 1 / (2 * Math.PI * cornerFrequencyHz),
        riseTimeSeconds: 1 / (4 * Math.PI * cornerFrequencyHz),
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Characteristic source duration from the Brune corner frequency: τ_c ≈ 1/(2π f_c).",
  id: "seismology/brune-source-time-duration-from-corner",
  inputs: [
    {
      minimum: 0,
      description: "Corner frequency.",
      id: "cornerFrequencyHz",
      kind: "number",
      label: "f_c",
      unit: "Hz",
    },
  ],
  outputs: [
    {
      description: "Characteristic source duration.",
      id: "sourceDurationSeconds",
      kind: "number",
      label: "τ_c",
      unit: "s",
    },
    {
      description: "Approximate rise time (τ_c/2).",
      id: "riseTimeSeconds",
      kind: "number",
      label: "τ_rise",
      unit: "s",
    },
  ],
  title: "Brune Source Time Duration From Corner Calculator",
});
export const runBruneSourceTimeDurationFromCorner =
  bruneSourceTimeDurationFromCornerTool.execute;
export { bruneSourceTimeDurationFromCornerExample as example };
export default bruneSourceTimeDurationFromCornerTool;
