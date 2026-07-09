import { createSimpleTool } from "../../core/simple.js";
export const scalarMultiplyTool = createSimpleTool({
  id: "vector/scalar-multiply",
  title: "Scalar Vector Multiplication Calculator",
  description: "Multiply every numeric vector component by a scalar.",
  inputs: [
    { id: "vector", label: "Vector", kind: "numberList", format: "vector" },
    { id: "scalar", label: "Scalar", kind: "number" },
  ],
  outputs: [
    {
      id: "vector",
      label: "Scaled vector",
      kind: "numberList",
      format: "vector",
    },
  ],
  calculate: (input) => {
    return {
      vector: (input.vector as number[]).map(
        (value) => value * (input.scalar as number),
      ),
    };
  },
});
export const runScalarMultiply = scalarMultiplyTool.execute;
export default scalarMultiplyTool;
