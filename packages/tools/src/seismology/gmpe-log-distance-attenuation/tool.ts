import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const gmpeLogDistanceAttenuationExample = {
  input: { magnitudeMw: 6, distanceKm: 30 },
  output: { pgaG: Math.pow(10, 3 - Math.log10(Math.hypot(30, 10)) - 2) },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const gmpeLogDistanceAttenuationTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ magnitudeMw, distanceKm, referenceKm }) => {
      const reference = referenceKm ?? 10;
      if (!(reference > 0))
        simpleError("referenceKm", "Reference distance must be positive.");
      const rEff = Math.sqrt(distanceKm ** 2 + reference ** 2);
      return { pgaG: Math.pow(10, 0.5 * magnitudeMw - Math.log10(rEff) - 2) };
    })(input as never) as Record<string, unknown>,
  description:
    "Simplified GMPE ground-motion attenuation with log-distance spreading.",
  id: "seismology/gmpe-log-distance-attenuation",
  inputs: [
    {
      description: "Moment magnitude.",
      id: "magnitudeMw",
      kind: "number",
      label: "M",
    },
    {
      minimum: 0,
      description: "Distance.",
      id: "distanceKm",
      kind: "number",
      label: "R",
      unit: "km",
    },
    {
      default: 10,
      description: "Reference distance for saturation.",
      id: "referenceKm",
      kind: "number",
      label: "R₀",
      unit: "km",
    },
  ],
  outputs: [
    {
      description: "Peak ground acceleration estimate.",
      id: "pgaG",
      kind: "number",
      label: "PGA",
      unit: "g",
    },
  ],
  title: "GMPE Log Distance Attenuation Calculator",
});
export const runGmpeLogDistanceAttenuation =
  gmpeLogDistanceAttenuationTool.execute;
export { gmpeLogDistanceAttenuationExample as example };
export default gmpeLogDistanceAttenuationTool;
