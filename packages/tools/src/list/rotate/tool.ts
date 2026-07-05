import { createSimpleTool } from "../../core/simple.js";
export const rotateTool = createSimpleTool({
  id: "list/rotate",
  title: "List Rotation Tool",
  description: "Rotate a string list by a signed number of positions.",
  inputs: [
    { id: "values", label: "Values", kind: "stringList" },
    { id: "positions", label: "Positions", kind: "integer" },
  ],
  outputs: [{ id: "values", label: "Rotated values", kind: "stringList" }],
  calculate: (input) => {
    const values = input.values as string[];
    if (values.length === 0) return { values: [] };
    const offset =
      (((input.positions as number) % values.length) + values.length) %
      values.length;
    return {
      values: [
        ...values.slice(-offset),
        ...values.slice(0, -offset || values.length),
      ],
    };
  },
});
export const runRotate = rotateTool.execute;
export default rotateTool;
