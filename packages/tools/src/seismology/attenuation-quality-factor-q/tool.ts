import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const attenuationQualityFactorQExample = {
  input: {
    amplitudeRatio: 0.5,
    frequencyHz: 1,
    pathLengthKm: 100,
    velocityKmS: 3.5,
  },
  output: {
    qualityFactorQ: 129.49600405220554,
    tStarSeconds: 0.2206356001526516,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const attenuationQualityFactorQTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ amplitudeRatio, frequencyHz, pathLengthKm, velocityKmS }) => {
      if (amplitudeRatio <= 0 || amplitudeRatio >= 1)
        simpleError(
          "amplitudeRatio",
          "Amplitude ratio must lie strictly between zero and one.",
        );
      if (!(frequencyHz > 0) || !(pathLengthKm > 0) || !(velocityKmS > 0))
        simpleError(
          "frequencyHz",
          "Frequency, path length, and velocity must be positive.",
        );
      const travelTime = pathLengthKm / velocityKmS;
      const tStarSeconds = -Math.log(amplitudeRatio) / (Math.PI * frequencyHz);
      return { qualityFactorQ: travelTime / tStarSeconds, tStarSeconds };
    })(input as never) as Record<string, unknown>,
  description:
    "Infer quality factor Q from amplitude decay along a propagation path: A = A₀·exp(−π f x / (Q v)).",
  id: "seismology/attenuation-quality-factor-q",
  inputs: [
    {
      minimum: 0,
      description: "Observed over initial amplitude.",
      id: "amplitudeRatio",
      kind: "number",
      label: "A/A₀",
    },
    {
      minimum: 0,
      description: "Frequency.",
      id: "frequencyHz",
      kind: "number",
      label: "f",
      unit: "Hz",
    },
    {
      minimum: 0,
      description: "Path length.",
      id: "pathLengthKm",
      kind: "number",
      label: "x",
      unit: "km",
    },
    {
      minimum: 0,
      description: "Wave velocity.",
      id: "velocityKmS",
      kind: "number",
      label: "v",
      unit: "km/s",
    },
  ],
  outputs: [
    {
      description: "Quality factor.",
      id: "qualityFactorQ",
      kind: "number",
      label: "Q",
    },
    {
      description: "Attenuation operator t* = x/(Qv).",
      id: "tStarSeconds",
      kind: "number",
      label: "t*",
      unit: "s",
    },
  ],
  title: "Attenuation Quality Factor Q Calculator",
});
export const runAttenuationQualityFactorQ =
  attenuationQualityFactorQTool.execute;
export { attenuationQualityFactorQExample as example };
export default attenuationQualityFactorQTool;
