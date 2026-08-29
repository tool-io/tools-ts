import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const refractionLayerCrossoverDistanceExample = {
  input: { layerThicknessM: 100, v1MS: 2000, v2MS: 4000 },
  output: {
    crossoverDistanceM: 200 * Math.sqrt(3),
    criticalAngleDeg: (Math.asin(0.5) * 180) / Math.PI,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const refractionLayerCrossoverDistanceTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ layerThicknessM, v1MS, v2MS }) => {
      if (!(layerThicknessM > 0) || !(v1MS > 0))
        simpleError(
          "layerThicknessM",
          "Layer thickness and upper velocity must be positive.",
        );
      if (v2MS <= v1MS) simpleError("v2MS", "Head wave requires V₂ > V₁.");
      return {
        crossoverDistanceM:
          2 * layerThicknessM * Math.sqrt((v2MS + v1MS) / (v2MS - v1MS)),
        criticalAngleDeg: (Math.asin(v1MS / v2MS) * 180) / Math.PI,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Crossover distance where direct and head waves arrive together: x_c = 2h·√((V₂+V₁)/(V₂−V₁)).",
  id: "seismology/refraction-layer-crossover-distance",
  inputs: [
    {
      minimum: 0,
      description: "Layer thickness.",
      id: "layerThicknessM",
      kind: "number",
      label: "h",
      unit: "m",
    },
    {
      minimum: 0,
      description: "Upper layer velocity.",
      id: "v1MS",
      kind: "number",
      label: "V₁",
      unit: "m/s",
    },
    {
      minimum: 0,
      description: "Half-space velocity.",
      id: "v2MS",
      kind: "number",
      label: "V₂",
      unit: "m/s",
    },
  ],
  outputs: [
    {
      description: "Crossover distance.",
      id: "crossoverDistanceM",
      kind: "number",
      label: "x_c",
      unit: "m",
    },
    {
      description: "Critical incidence angle.",
      id: "criticalAngleDeg",
      kind: "number",
      label: "θ_c",
      unit: "°",
    },
  ],
  title: "Refraction Layer Crossover Distance Calculator",
});
export const runRefractionLayerCrossoverDistance =
  refractionLayerCrossoverDistanceTool.execute;
export { refractionLayerCrossoverDistanceExample as example };
export default refractionLayerCrossoverDistanceTool;
