import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const withersHeightWeightExample = {
  input: { withersCm: 140 },
} satisfies ToolExample<{
  readonly withersCm: number;
}>;

export const withersHeightWeightTool = createSimpleTool({
  id: "biology/withers-height-weight",
  title: "Withers Height Weight Class",
  description:
    "Classify livestock frame size as small, medium, or large from the withers height in centimetres.",
  inputs: [{ id: "withersCm", label: "Withers height cm", kind: "number" }],
  outputs: [{ id: "sizeClass", label: "Size class", kind: "string" }],
  calculate: (input) => {
    const withersCm = input.withersCm as number;
    if (withersCm <= 0)
      simpleError("withersCm", "Withers height must be greater than zero.");
    return {
      sizeClass:
        withersCm < 120 ? "small" : withersCm <= 145 ? "medium" : "large",
    };
  },
});
export const runWithersHeightWeight = withersHeightWeightTool.execute;
export default withersHeightWeightTool;
