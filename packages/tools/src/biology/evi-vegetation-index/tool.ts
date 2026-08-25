import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EviVegetationIndexInput = {
  readonly blueReflectance: number;
  readonly nirReflectance: number;
  readonly redReflectance: number;
};

export type EviVegetationIndexOutput = {
  readonly evi: number;
};

export const eviVegetationIndexExample = {
  input: { blueReflectance: 0.05, nirReflectance: 0.5, redReflectance: 0.1 },
  output: { evi: 0.5797101449275363 },
} satisfies ToolExample<EviVegetationIndexInput, EviVegetationIndexOutput>;

export const eviVegetationIndexTool = createSimpleTool({
  id: "biology/evi-vegetation-index",
  title: "EVI Calculator",
  description:
    "Compute the Enhanced Vegetation Index as 2.5 * (NIR - red) / (NIR + 6 * red - 7.5 * blue + 1) from reflectances between zero and one, rejecting degenerate reflectances that zero the denominator.",
  inputs: [
    {
      description: "Blue-band reflectance between 0 and 1.",
      id: "blueReflectance",
      kind: "number",
      label: "Blue reflectance",
      maximum: 1,
      minimum: 0,
    },
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
      description: "EVI value; signed and typically below one.",
      id: "evi",
      kind: "number",
      label: "EVI",
    },
  ],
  calculate: (input) => {
    const blueReflectance = input.blueReflectance as number;
    const nirReflectance = input.nirReflectance as number;
    const redReflectance = input.redReflectance as number;
    const denominator =
      nirReflectance + 6 * redReflectance - 7.5 * blueReflectance + 1;
    if (!(denominator !== 0))
      simpleError(
        "nirReflectance",
        "The reflectances combine to a zero denominator.",
        "degenerate_reflectances",
      );
    return { evi: (2.5 * (nirReflectance - redReflectance)) / denominator };
  },
});
export const runEviVegetationIndex = eviVegetationIndexTool.execute;
export default eviVegetationIndexTool;
