import { createSimpleTool, simpleError } from "../../core/simple.js";
export const hammingTool = createSimpleTool({
  id: "distance/hamming",
  title: "Hamming Distance Calculator",
  description:
    "Count differing Unicode code-point positions in equal-length strings.",
  inputs: [
    { id: "first", label: "First text", kind: "string" },
    { id: "second", label: "Second text", kind: "string" },
  ],
  outputs: [
    {
      id: "distance",
      label: "Hamming distance",
      kind: "integer",
      format: "distance",
    },
  ],
  calculate: (input) => {
    const first = [...(input.first as string)],
      second = [...(input.second as string)];
    if (first.length !== second.length)
      simpleError("second", "Strings must have equal character lengths.");
    return {
      distance: first.reduce(
        (sum, value, index) => sum + (value === second[index] ? 0 : 1),
        0,
      ),
    };
  },
});
export const runHamming = hammingTool.execute;
export default hammingTool;
