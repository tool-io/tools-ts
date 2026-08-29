import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const locationFormalErrorScaleFactorExample = {
  input: { rmsSeconds: 0.2, phaseVelocityKmS: 6.2, readingCount: 12 },
  output: { formalErrorKm: 1.5186836405255706, wellConstrained: true },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const locationFormalErrorScaleFactorTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ rmsSeconds, phaseVelocityKmS, readingCount }) => {
      if (readingCount <= 4)
        simpleError("readingCount", "More than four readings are required.");
      if (phaseVelocityKmS <= 0)
        simpleError("phaseVelocityKmS", "Phase velocity must be positive.");
      const formalErrorKm =
        rmsSeconds *
        phaseVelocityKmS *
        Math.sqrt(readingCount / (readingCount - 4));
      return { formalErrorKm, wellConstrained: formalErrorKm < 2 };
    })(input as never) as Record<string, unknown>,
  description: "Heuristic horizontal formal error: σ_h ≈ RMS·v_p·√(N/(N−4)).",
  id: "seismology/location-formal-error-scale-factor",
  inputs: [
    {
      minimum: 0,
      description: "Travel-time RMS residual.",
      id: "rmsSeconds",
      kind: "number",
      label: "RMS",
      unit: "s",
    },
    {
      default: 6.2,
      minimum: 0,
      description: "Representative phase speed.",
      id: "phaseVelocityKmS",
      kind: "number",
      label: "v",
      unit: "km/s",
    },
    {
      minimum: 1,
      description: "Number of readings.",
      id: "readingCount",
      kind: "integer",
      label: "N",
    },
  ],
  outputs: [
    {
      description: "Scaled horizontal formal error.",
      id: "formalErrorKm",
      kind: "number",
      label: "σ_h",
      unit: "km",
    },
    {
      description: "Whether the error is under 2 km.",
      id: "wellConstrained",
      kind: "boolean",
      label: "Good?",
    },
  ],
  title: "Location Formal Error Scale Factor Calculator",
});
export const runLocationFormalErrorScaleFactor =
  locationFormalErrorScaleFactorTool.execute;
export { locationFormalErrorScaleFactorExample as example };
export default locationFormalErrorScaleFactorTool;
