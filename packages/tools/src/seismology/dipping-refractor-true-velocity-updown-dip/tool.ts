import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const dippingRefractorTrueVelocityUpdownDipExample = {
  input: { updipApparentMS: 3800, downdipApparentMS: 4200, dipAngleDeg: 10 },
  output: {
    trueVelocityMS: 3929.3829345187096,
    dipCorrectionPercent: 1.5192246987792082,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const dippingRefractorTrueVelocityUpdownDipTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ updipApparentMS, downdipApparentMS, dipAngleDeg }) => {
      if (updipApparentMS <= 0 || downdipApparentMS <= 0)
        simpleError("updipApparentMS", "Apparent velocities must be positive.");
      if ((dipAngleDeg ?? 0) < 0 || (dipAngleDeg ?? 0) >= 90)
        simpleError(
          "dipAngleDeg",
          "Dip must lie from zero up to, but not including, 90 degrees.",
        );
      const cosA = Math.cos(((dipAngleDeg ?? 0) * Math.PI) / 180);
      const trueVelocityMS =
        (2 * updipApparentMS * downdipApparentMS * cosA) /
        (updipApparentMS + downdipApparentMS);
      const naive =
        (2 * updipApparentMS * downdipApparentMS) /
        (updipApparentMS + downdipApparentMS);
      return {
        trueVelocityMS,
        dipCorrectionPercent: ((naive - trueVelocityMS) / naive) * 100,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "True refractor velocity from updip/downdip apparent velocities: V₂ = 2V_uV_d·cosα/(V_u+V_d).",
  id: "seismology/dipping-refractor-true-velocity-updown-dip",
  inputs: [
    {
      minimum: 0,
      description: "Updip apparent velocity.",
      id: "updipApparentMS",
      kind: "number",
      label: "V_u",
      unit: "m/s",
    },
    {
      minimum: 0,
      description: "Downdip apparent velocity.",
      id: "downdipApparentMS",
      kind: "number",
      label: "V_d",
      unit: "m/s",
    },
    {
      default: 0,
      minimum: 0,
      maximum: 89.999999,
      description: "Refractor dip.",
      id: "dipAngleDeg",
      kind: "number",
      label: "α",
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "True refractor velocity.",
      id: "trueVelocityMS",
      kind: "number",
      label: "V₂",
      unit: "m/s",
    },
    {
      description: "Magnitude of the dip correction.",
      id: "dipCorrectionPercent",
      kind: "number",
      label: "Δ%",
      unit: "%",
    },
  ],
  title: "Dipping Refractor True Velocity UpDown Dip Calculator",
});
export const runDippingRefractorTrueVelocityUpdownDip =
  dippingRefractorTrueVelocityUpdownDipTool.execute;
export { dippingRefractorTrueVelocityUpdownDipExample as example };
export default dippingRefractorTrueVelocityUpdownDipTool;
