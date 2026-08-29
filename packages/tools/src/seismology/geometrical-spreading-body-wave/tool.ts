import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const geometricalSpreadingBodyWaveExample = {
  input: { distanceKm: 50 },
  output: { spreadingFactor: 0.02 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const geometricalSpreadingBodyWaveTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ distanceKm, referenceKm }) => {
      const reference = referenceKm ?? 1;
      if (!(distanceKm > 0))
        simpleError("distanceKm", "Distance must be positive.");
      if (!(reference > 0))
        simpleError("referenceKm", "Reference distance must be positive.");
      return { spreadingFactor: reference / distanceKm };
    })(input as never) as Record<string, unknown>,
  description:
    "Body-wave geometrical spreading amplitude decays as 1/r relative to a reference distance.",
  id: "seismology/geometrical-spreading-body-wave",
  inputs: [
    {
      minimum: 0,
      description: "Distance.",
      id: "distanceKm",
      kind: "number",
      label: "r",
      unit: "km",
    },
    {
      default: 1,
      description: "Reference distance.",
      id: "referenceKm",
      kind: "number",
      label: "r₀",
      unit: "km",
    },
  ],
  outputs: [
    {
      description: "Amplitude spreading factor.",
      id: "spreadingFactor",
      kind: "number",
      label: "r₀/r",
    },
  ],
  title: "Geometrical Spreading Body Wave Calculator",
});
export const runGeometricalSpreadingBodyWave =
  geometricalSpreadingBodyWaveTool.execute;
export { geometricalSpreadingBodyWaveExample as example };
export default geometricalSpreadingBodyWaveTool;
