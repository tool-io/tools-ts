import { createSimpleTool, simpleError } from "../../core/simple.js";
export const addTool = createSimpleTool({
  id: "vector/add",
  title: "Vector Addition Calculator",
  description: "Add two equal-length numeric vectors component by component.",
  inputs: [
    {
      id: "first",
      label: "First vector",
      kind: "numberList",
      format: "vector",
    },
    {
      id: "second",
      label: "Second vector",
      kind: "numberList",
      format: "vector",
    },
  ],
  outputs: [
    { id: "vector", label: "Sum vector", kind: "numberList", format: "vector" },
  ],
  calculate: (input) => {
    const first = input.first as number[],
      second = input.second as number[];
    if (first.length === 0 || first.length !== second.length)
      simpleError("second", "Vectors must have the same nonzero length.");
    return { vector: first.map((value, index) => value + second[index]!) };
  },
});
export const runAdd = addTool.execute;
export default addTool;
