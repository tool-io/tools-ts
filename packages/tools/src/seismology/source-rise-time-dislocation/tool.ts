import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const sourceRiseTimeDislocationExample = {
  input: { faultWidthKm: 10 },
  output: { riseTimeSeconds: 2.857142857142857 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const sourceRiseTimeDislocationTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ faultWidthKm, shearWaveVelocityKmS }) => {
      const velocity = shearWaveVelocityKmS ?? 3.5;
      if (!(faultWidthKm > 0))
        simpleError("faultWidthKm", "Fault width must be positive.");
      if (!(velocity > 0))
        simpleError(
          "shearWaveVelocityKmS",
          "Shear-wave velocity must be positive.",
        );
      return { riseTimeSeconds: faultWidthKm / velocity };
    })(input as never) as Record<string, unknown>,
  description:
    "Characteristic source timescale estimated as fault width divided by shear-wave velocity; this is a dimensional proxy, not a fitted rupture rise-time model.",
  id: "seismology/source-rise-time-dislocation",
  inputs: [
    {
      minimum: 0,
      description: "Down-dip fault width.",
      id: "faultWidthKm",
      kind: "number",
      label: "W",
      unit: "km",
    },
    {
      default: 3.5,
      description: "Shear wave velocity.",
      id: "shearWaveVelocityKmS",
      kind: "number",
      label: "β",
      unit: "km/s",
    },
  ],
  outputs: [
    {
      description: "Source rise time.",
      id: "riseTimeSeconds",
      kind: "number",
      label: "τ_r",
      unit: "s",
    },
  ],
  title: "Source Rise Time Dislocation Calculator",
});
export const runSourceRiseTimeDislocation =
  sourceRiseTimeDislocationTool.execute;
export { sourceRiseTimeDislocationExample as example };
export default sourceRiseTimeDislocationTool;
