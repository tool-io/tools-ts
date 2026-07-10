import { createSimpleTool, simpleError } from "../../core/simple.js";
export const normalizeTool = createSimpleTool({
  id: "vector/normalize",
  title: "Vector Normalization Calculator",
  description:
    "Normalize a nonzero numeric vector to unit Euclidean magnitude.",
  inputs: [
    { id: "vector", label: "Vector", kind: "numberList", format: "vector" },
  ],
  outputs: [
    {
      id: "vector",
      label: "Unit vector",
      kind: "numberList",
      format: "vector",
    },
    { id: "magnitude", label: "Original magnitude", kind: "number" },
  ],
  calculate: (input) => {
    const vector = input.vector as number[];
    if (vector.length === 0) simpleError("vector", "Enter a nonempty vector.");
    const magnitude = Math.hypot(...vector);
    if (magnitude === 0)
      simpleError("vector", "Vector magnitude must be nonzero.");
    return { vector: vector.map((value) => value / magnitude), magnitude };
  },
});
export const runNormalize = normalizeTool.execute;
export default normalizeTool;
