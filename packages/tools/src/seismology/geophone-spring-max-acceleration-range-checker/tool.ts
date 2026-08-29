import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const geophoneSpringMaxAccelerationRangeCheckerExample = {
  input: { naturalFrequencyHz: 4.5, maxDisplacementM: 0.002 },
  output: { maxAccelerationG: 0.16303996910019997, clippingLikelyAt1g: true },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const geophoneSpringMaxAccelerationRangeCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ naturalFrequencyHz, maxDisplacementM }) => {
      if (naturalFrequencyHz <= 0)
        simpleError(
          "naturalFrequencyHz",
          "Natural frequency must be positive.",
        );
      if (maxDisplacementM <= 0)
        simpleError("maxDisplacementM", "Mechanical travel must be positive.");
      const w0 = 2 * Math.PI * naturalFrequencyHz;
      const aMS2 = w0 * w0 * maxDisplacementM;
      return {
        maxAccelerationG: aMS2 / 9.80665,
        clippingLikelyAt1g: aMS2 / 9.80665 < 1,
      };
    })(input as never) as Record<string, unknown>,
  description: "Mass-spring clip level: a_max = ω₀²·x_max expressed in g.",
  id: "seismology/geophone-spring-max-acceleration-range-checker",
  inputs: [
    {
      minimum: 0,
      description: "Natural frequency.",
      id: "naturalFrequencyHz",
      kind: "number",
      label: "f₀",
      unit: "Hz",
    },
    {
      minimum: 0,
      description: "Mechanical travel limit.",
      id: "maxDisplacementM",
      kind: "number",
      label: "x_max",
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Clip acceleration.",
      id: "maxAccelerationG",
      kind: "number",
      label: "a_max",
      unit: "g",
    },
    {
      description: "Whether the clip level is below one g.",
      id: "clippingLikelyAt1g",
      kind: "boolean",
      label: "Clips at 1 g?",
    },
  ],
  title: "Geophone Spring Max Acceleration Range Checker",
});
export const runGeophoneSpringMaxAccelerationRangeChecker =
  geophoneSpringMaxAccelerationRangeCheckerTool.execute;
export { geophoneSpringMaxAccelerationRangeCheckerExample as example };
export default geophoneSpringMaxAccelerationRangeCheckerTool;
