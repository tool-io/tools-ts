import { createSimpleTool, simpleError } from "../../core/simple.js";
export const inverseTool = createSimpleTool({
  id: "proportions/inverse",
  title: "Inverse Proportion Calculator",
  description:
    "Solve an inverse proportion where the product of paired values remains constant.",
  inputs: [
    { id: "firstX", label: "First x", kind: "number" },
    { id: "firstY", label: "First y", kind: "number" },
    { id: "secondX", label: "Second x", kind: "number" },
  ],
  outputs: [{ id: "secondY", label: "Second y", kind: "number" }],
  calculate: (input) => {
    const x = input.secondX as number;
    if (x === 0) simpleError("secondX", "Second x must not be zero.");
    return {
      secondY: ((input.firstX as number) * (input.firstY as number)) / x,
    };
  },
});
export const runInverse = inverseTool.execute;
export default inverseTool;
