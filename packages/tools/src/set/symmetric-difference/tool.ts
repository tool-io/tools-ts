import { createSimpleTool } from "../../core/simple.js";
export const symmetricDifferenceTool = createSimpleTool({
  id: "set/symmetric-difference",
  title: "List Symmetric Difference Tool",
  description: "Return unique strings found in exactly one of two lists.",
  inputs: [
    { id: "first", label: "First list", kind: "stringList" },
    { id: "second", label: "Second list", kind: "stringList" },
  ],
  outputs: [
    { id: "values", label: "Symmetric difference", kind: "stringList" },
  ],
  calculate: (input) => {
    const first = new Set(input.first as string[]),
      second = new Set(input.second as string[]);
    return {
      values: [...first]
        .filter((value) => !second.has(value))
        .concat([...second].filter((value) => !first.has(value))),
    };
  },
});
export const runSymmetricDifference = symmetricDifferenceTool.execute;
export default symmetricDifferenceTool;
