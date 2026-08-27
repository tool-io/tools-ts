import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const plateletCountExample = {
  input: { countedPlatelets: 250 },
  output: { plateletsKPerUl: 25000 },
} satisfies ToolExample<
  { readonly countedPlatelets: number },
  { readonly plateletsKPerUl: number }
>;

export const plateletCountTool = createSimpleTool({
  id: "biology/platelet-count",
  title: "Platelet Count Correction",
  description:
    "Correct a counted platelet number by the dilution factor and the number of counting chambers.",
  inputs: [
    {
      id: "countedPlatelets",
      label: "Counted platelets",
      kind: "number",
      minimum: 0,
    },
    {
      default: 100,
      id: "dilutionFactor",
      label: "Dilution factor",
      kind: "number",
      minimum: 1,
    },
    {
      default: 1,
      id: "countingChambersInt",
      label: "Counting chambers",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "plateletsKPerUl",
      label: "Corrected platelets",
      kind: "number",
      unit: "K/uL",
    },
  ],
  calculate: (input) => ({
    plateletsKPerUl:
      ((input.countedPlatelets as number) * (input.dilutionFactor as number)) /
      (input.countingChambersInt as number),
  }),
});
export const runPlateletCount = plateletCountTool.execute;
export default plateletCountTool;
