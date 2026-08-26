import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NdviVegetationIndexInput = {
  readonly nirReflectance: number;
  readonly redReflectance: number;
};

export type NdviVegetationIndexOutput = {
  readonly ndvi: number;
};

export const ndviVegetationIndexExample = {
  input: { nirReflectance: 0.5, redReflectance: 0.1 },
  output: { ndvi: 0.6666666666666667 },
} satisfies ToolExample<NdviVegetationIndexInput, NdviVegetationIndexOutput>;

export const ndviVegetationIndexTool = createSimpleTool({
  id: "biology/ndvi-vegetation-index",
  title: "NDVI Calculator",
  description:
    "Compute the Normalized Difference Vegetation Index as (NIR - red) / (NIR + red) from reflectances between zero and one, rejecting dark pixels whose reflectances sum to zero.",
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
      description: "Red-band reflectance between 0 and 1.",
      id: "redReflectance",
      kind: "number",
      label: "Red reflectance",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "NDVI value between -1 and 1.",
      id: "ndvi",
      kind: "number",
      label: "NDVI",
    },
  ],
  calculate: (input) => {
    const nirReflectance = input.nirReflectance as number;
    const redReflectance = input.redReflectance as number;
    if (!(nirReflectance + redReflectance > 0))
      simpleError(
        "nirReflectance",
        "The reflectances sum to zero, which indicates a dark pixel.",
        "dark_pixel",
      );
    return {
      ndvi:
        (nirReflectance - redReflectance) / (nirReflectance + redReflectance),
    };
  },
});
export const runNdviVegetationIndex = ndviVegetationIndexTool.execute;
export default ndviVegetationIndexTool;
