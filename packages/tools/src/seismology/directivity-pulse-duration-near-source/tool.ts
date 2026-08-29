import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const directivityPulseDurationNearSourceExample = {
  input: { faultLengthKm: 20, ruptureVelocityKmS: 2.8 },
  output: { pulseDurationSeconds: 1.428571428571429 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const directivityPulseDurationNearSourceTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ faultLengthKm, ruptureVelocityKmS, betaKmS }) => {
      const b = betaKmS ?? 3.5;
      if (!(faultLengthKm > 0))
        simpleError("faultLengthKm", "Fault length must be positive.");
      if (!(ruptureVelocityKmS > 0) || !(b > 0))
        simpleError(
          "ruptureVelocityKmS",
          "Rupture and shear-wave velocities must be positive.",
        );
      if (ruptureVelocityKmS >= b)
        simpleError("ruptureVelocityKmS", "v_r must be below β.");
      return {
        pulseDurationSeconds:
          (faultLengthKm / ruptureVelocityKmS) * (1 - ruptureVelocityKmS / b),
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Forward-directivity timescale for a unilateral rupture, L·(1/v_r − 1/β), assuming the site lies along strike in the rupture direction.",
  id: "seismology/directivity-pulse-duration-near-source",
  inputs: [
    {
      minimum: 0,
      description: "Fault length.",
      id: "faultLengthKm",
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
    {
      default: 3.5,
      description: "Shear wave velocity.",
      id: "betaKmS",
      kind: "number",
      label: "β",
      unit: "km/s",
    },
  ],
  outputs: [
    {
      description: "Pulse duration at near-fault sites.",
      id: "pulseDurationSeconds",
      kind: "number",
      label: "T_p",
      unit: "s",
    },
  ],
  title: "Directivity Pulse Duration Near Source Calculator",
});
export const runDirectivityPulseDurationNearSource =
  directivityPulseDurationNearSourceTool.execute;
export { directivityPulseDurationNearSourceExample as example };
export default directivityPulseDurationNearSourceTool;
