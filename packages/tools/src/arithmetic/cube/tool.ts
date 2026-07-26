import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cubeExample = {
  input: { value: 3 },
} satisfies ToolExample<{ readonly value: number }>;

export const cubeTool = createSimpleTool({
  id: "arithmetic/cube",
  title: "Cube Calculator",
  description: "Calculate the cube of a finite number.",
  inputs: [{ id: "value", label: "Value", kind: "number" }],
  outputs: [{ id: "cube", label: "Cube", kind: "number" }],
  calculate: (input) => {
    const cube = (input.value as number) ** 3;
    if (!Number.isFinite(cube))
      simpleError("value", "The cube exceeds the finite number range.");
    return { cube };
  },
});
export const runCube = cubeTool.execute;
export default cubeTool;
