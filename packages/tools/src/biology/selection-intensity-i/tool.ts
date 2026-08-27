import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SelectionIntensityIInput = {
  readonly phenotypicStandardDeviation: number;
  readonly selectionDifferenceS: number;
};

export type SelectionIntensityIOutput = {
  readonly selectionIntensityI: number;
};

export const selectionIntensityIExample = {
  input: { phenotypicStandardDeviation: 4, selectionDifferenceS: 2 },
  output: { selectionIntensityI: 0.5 },
} satisfies ToolExample<SelectionIntensityIInput, SelectionIntensityIOutput>;

export const selectionIntensityITool = createSimpleTool({
  id: "biology/selection-intensity-i",
  title: "Selection Intensity i",
  description:
    "Compute the standardized selection intensity as the signed selection difference divided by the phenotypic standard deviation.",
  inputs: [
    {
      id: "selectionDifferenceS",
      label: "Selection difference S",
      kind: "number",
    },
    {
      description: "Phenotypic standard deviation of the trait.",
      id: "phenotypicStandardDeviation",
      label: "Phenotypic SD",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "selectionIntensityI",
      label: "Selection intensity i",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const phenotypicStandardDeviation =
      input.phenotypicStandardDeviation as number;
    if (phenotypicStandardDeviation <= 0)
      simpleError(
        "phenotypicStandardDeviation",
        "The phenotypic standard deviation must be greater than zero.",
      );
    return {
      selectionIntensityI:
        (input.selectionDifferenceS as number) / phenotypicStandardDeviation,
    };
  },
});
export const runSelectionIntensityI = selectionIntensityITool.execute;
export default selectionIntensityITool;
