import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const directivityNarrowbandPulsePeriodCalculatorExample = {
  input: { ruptureLengthKm: 14, ruptureVelocityKmS: 2.8 },
  output: { pulsePeriodSeconds: 5 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const directivityNarrowbandPulsePeriodCalculatorTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ ruptureLengthKm, ruptureVelocityKmS }) => {
      if (!(ruptureLengthKm > 0))
        simpleError("ruptureLengthKm", "Rupture length must be positive.");
      if (!(ruptureVelocityKmS > 0))
        simpleError("ruptureVelocityKmS", "Rupture velocity must be positive.");
      return { pulsePeriodSeconds: ruptureLengthKm / ruptureVelocityKmS };
    })(input as never) as Record<string, unknown>,
  description:
    "First-order rupture-duration proxy for directivity pulse period: T_p ≈ L/v_r.",
  id: "seismology/directivity-narrowband-pulse-period",
  inputs: [
    {
      minimum: 0,
      description: "Sub-fault rupture length.",
      id: "ruptureLengthKm",
      kind: "number",
      label: "L",
      unit: "km",
    },
    {
      minimum: 0,
      description: "Rupture velocity.",
      id: "ruptureVelocityKmS",
      kind: "number",
      label: "v_r",
      unit: "km/s",
    },
  ],
  outputs: [
    {
      description: "Narrowband pulse period.",
      id: "pulsePeriodSeconds",
      kind: "number",
      label: "T_p",
      unit: "s",
    },
  ],
  title: "Directivity Narrowband Pulse Period Calculator",
});
export const runDirectivityNarrowbandPulsePeriodCalculator =
  directivityNarrowbandPulsePeriodCalculatorTool.execute;
export { directivityNarrowbandPulsePeriodCalculatorExample as example };
export default directivityNarrowbandPulsePeriodCalculatorTool;
