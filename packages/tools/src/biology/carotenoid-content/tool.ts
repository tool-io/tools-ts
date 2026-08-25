import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CarotenoidContentInput = {
  readonly absorbance480: number;
  readonly leafFreshMassG: number;
};

export type CarotenoidContentOutput = {
  readonly carotenoidsUgPerG: number;
};

export const carotenoidContentExample = {
  input: { absorbance480: 0.35, leafFreshMassG: 0.5 },
  output: { carotenoidsUgPerG: 2.8 },
} satisfies ToolExample<CarotenoidContentInput, CarotenoidContentOutput>;

export const carotenoidContentTool = createSimpleTool({
  id: "biology/carotenoid-content",
  title: "Carotenoid Content",
  description:
    "Estimate total carotenoid content in micrograms per gram of leaf fresh mass as the absorbance at 480 nanometers times four divided by the fresh mass, following the documented Arnon-proxy extinction scaling.",
  inputs: [
    {
      description: "Absorbance at 480 nanometers; must not be negative.",
      id: "absorbance480",
      kind: "number",
      label: "Absorbance at 480 nm",
      minimum: 0,
    },
    {
      description: "Leaf fresh mass in grams; must be greater than zero.",
      id: "leafFreshMassG",
      kind: "number",
      label: "Leaf fresh mass",
      unit: "g",
    },
  ],
  outputs: [
    {
      description:
        "Carotenoid content in micrograms per gram of leaf fresh mass.",
      id: "carotenoidsUgPerG",
      kind: "number",
      label: "Carotenoid content",
      unit: "ug/g",
    },
  ],
  calculate: (input) => {
    const absorbance480 = input.absorbance480 as number;
    const leafFreshMassG = input.leafFreshMassG as number;
    if (!(leafFreshMassG > 0))
      simpleError(
        "leafFreshMassG",
        "The leaf fresh mass must be greater than zero.",
      );
    return { carotenoidsUgPerG: (absorbance480 * 4) / leafFreshMassG };
  },
});
export const runCarotenoidContent = carotenoidContentTool.execute;
export default carotenoidContentTool;
