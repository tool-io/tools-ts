import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NdviRedEdgeInput = {
  readonly nirReflectance: number;
  readonly redEdgeReflectance: number;
};

export type NdviRedEdgeOutput = {
  readonly redEdgeNdvi: number;
};

export const ndviRedEdgeExample = {
  input: { nirReflectance: 0.5, redEdgeReflectance: 0.15 },
  output: { redEdgeNdvi: 0.5384615384615384 },
} satisfies ToolExample<NdviRedEdgeInput, NdviRedEdgeOutput>;

export const ndviRedEdgeTool = createSimpleTool({
  id: "biology/ndvi-red-edge",
  title: "Red Edge NDVI",
  description:
    "Compute the red edge normalized difference vegetation index as (NIR - red edge) / (NIR + red edge) from reflectances between zero and one, rejecting dark pixels whose reflectances sum to zero.",
  inputs: [
    {
      description: "Near-infrared reflectance between 0 and 1.",
      id: "nirReflectance",
      kind: "number",
      label: "NIR reflectance",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Red edge reflectance between 0 and 1.",
      id: "redEdgeReflectance",
      kind: "number",
      label: "Red edge reflectance",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Red edge NDVI value between -1 and 1; signed.",
      id: "redEdgeNdvi",
      kind: "number",
      label: "Red edge NDVI",
    },
  ],
  calculate: (input) => {
    const nirReflectance = input.nirReflectance as number;
    const redEdgeReflectance = input.redEdgeReflectance as number;
    if (!(nirReflectance + redEdgeReflectance > 0))
      simpleError(
        "nirReflectance",
        "The reflectances sum to zero, which indicates a dark pixel.",
        "dark_pixel",
      );
    return {
      redEdgeNdvi:
        (nirReflectance - redEdgeReflectance) /
        (nirReflectance + redEdgeReflectance),
    };
  },
});
export const runNdviRedEdge = ndviRedEdgeTool.execute;
export default ndviRedEdgeTool;
