import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const dressingPercentageExample = {
  input: { hotCarcassKg: 340, shrunkLiveWeightKg: 680 },
} satisfies ToolExample<{
  readonly hotCarcassKg: number;
  readonly shrunkLiveWeightKg: number;
}>;

export const dressingPercentageTool = createSimpleTool({
  id: "biology/dressing-percentage",
  title: "Dressing Percentage",
  description:
    "Compute dressing percentage as the hot carcass weight percentage of the shrunk live weight.",
  inputs: [
    { id: "hotCarcassKg", label: "Hot carcass kg", kind: "number" },
    {
      id: "shrunkLiveWeightKg",
      label: "Shrunk live weight kg",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "dressingPercentage",
      label: "Dressing percentage",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const hotCarcassKg = input.hotCarcassKg as number;
    const shrunkLiveWeightKg = input.shrunkLiveWeightKg as number;
    if (hotCarcassKg < 0)
      simpleError("hotCarcassKg", "Hot carcass weight must not be negative.");
    if (shrunkLiveWeightKg <= 0)
      simpleError(
        "shrunkLiveWeightKg",
        "Shrunk live weight must be greater than zero.",
      );
    if (hotCarcassKg > shrunkLiveWeightKg)
      simpleError(
        "hotCarcassKg",
        "Hot carcass weight must not exceed shrunk live weight.",
      );
    return {
      dressingPercentage: (hotCarcassKg / shrunkLiveWeightKg) * 100,
    };
  },
});
export const runDressingPercentage = dressingPercentageTool.execute;
export default dressingPercentageTool;
