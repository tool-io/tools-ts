import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const surfaceWaveSpreadingHalfSpaceExample = {
  input: { distanceKm: 100 },
  output: { spreadingFactor: 0.1 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const surfaceWaveSpreadingHalfSpaceTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ distanceKm, referenceKm }) => {
      const reference = referenceKm ?? 1;
      if (!(distanceKm > 0))
        simpleError("distanceKm", "Distance must be positive.");
      if (!(reference > 0))
        simpleError("referenceKm", "Reference distance must be positive.");
      return { spreadingFactor: Math.sqrt(reference / distanceKm) };
    })(input as never) as Record<string, unknown>,
  description: "Surface waves in a half-space spread geometrically as 1/√r.",
  id: "seismology/surface-wave-spreading-half-space",
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
      label: "√(r₀/r)",
    },
  ],
  title: "Surface Wave Spreading Half Space Calculator",
});
export const runSurfaceWaveSpreadingHalfSpace =
  surfaceWaveSpreadingHalfSpaceTool.execute;
export { surfaceWaveSpreadingHalfSpaceExample as example };
export default surfaceWaveSpreadingHalfSpaceTool;
