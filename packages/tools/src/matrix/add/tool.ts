import { createSimpleTool, simpleError } from "../../core/simple.js";
export const addTool = createSimpleTool({
  id: "matrix/add",
  title: "Matrix Addition Calculator",
  description: "Add two equal-shaped numeric matrices.",
  inputs: [
    { id: "first", label: "First matrix", kind: "matrix", format: "matrix" },
    { id: "second", label: "Second matrix", kind: "matrix", format: "matrix" },
  ],
  outputs: [
    { id: "matrix", label: "Sum matrix", kind: "matrix", format: "matrix" },
  ],
  calculate: (input) => {
    const first = input.first as number[][],
      second = input.second as number[][];
    if (
      first.length === 0 ||
      first.length !== second.length ||
      first[0]!.length === 0 ||
      first.some(
        (row, index) =>
          row.length !== first[0]!.length ||
          second[index]?.length !== row.length,
      )
    )
      simpleError(
        "second",
        "Matrices must have the same nonempty rectangular shape.",
      );
    return {
      matrix: first.map((row, r) =>
        row.map((value, c) => value + second[r]![c]!),
      ),
    };
  },
});
export const runAdd = addTool.execute;
export default addTool;
