import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const canopyCoverPercentageExample = {
  input: { canopyAreaM2: 40, totalAreaM2: 100 },
  output: { canopyCoverPercent: 40 },
} satisfies ToolExample<
  { readonly canopyAreaM2: number; readonly totalAreaM2: number },
  { readonly canopyCoverPercent: number }
>;

export const canopyCoverPercentageTool = createSimpleTool({
  id: "biology/canopy-cover-percentage",
  title: "Canopy Cover %",
  description:
    "Compute canopy cover as canopy area divided by total plot area times 100.",
  inputs: [
    {
      description:
        "Ground area covered by canopy; must be non-negative and not exceed the total plot area.",
      id: "canopyAreaM2",
      label: "Canopy area",
      kind: "number",
      unit: "m^2",
    },
    {
      description: "Total plot area; must be greater than zero.",
      id: "totalAreaM2",
      label: "Total area",
      kind: "number",
      unit: "m^2",
    },
  ],
  outputs: [
    {
      description: "Canopy cover percentage between 0 and 100.",
      id: "canopyCoverPercent",
      label: "Canopy cover",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const canopyAreaM2 = input.canopyAreaM2 as number;
    const totalAreaM2 = input.totalAreaM2 as number;
    if (!(canopyAreaM2 >= 0))
      simpleError("canopyAreaM2", "The canopy area must not be negative.");
    if (!(totalAreaM2 > 0))
      simpleError("totalAreaM2", "The total area must be greater than zero.");
    if (canopyAreaM2 > totalAreaM2)
      simpleError(
        "canopyAreaM2",
        "The canopy area must not exceed the total area.",
      );
    return { canopyCoverPercent: (canopyAreaM2 / totalAreaM2) * 100 };
  },
});
export const runCanopyCoverPercentage = canopyCoverPercentageTool.execute;
export default canopyCoverPercentageTool;
