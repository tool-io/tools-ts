import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const simpsonReciprocalExample = {
  input: { simpsonD: 0.2 },
  output: { simpsonReciprocal: 5 },
} satisfies ToolExample<
  { readonly simpsonD: number },
  { readonly simpsonReciprocal: number }
>;

export const simpsonReciprocalTool = createSimpleTool({
  id: "biology/dominance-simpson-reciprocal",
  title: "Simpson Reciprocal",
  description:
    "Compute the reciprocal Simpson diversity as one divided by the Simpson concentration.",
  inputs: [{ id: "simpsonD", label: "Simpson concentration", kind: "number" }],
  outputs: [
    {
      id: "simpsonReciprocal",
      label: "Reciprocal Simpson diversity",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const simpsonD = input.simpsonD as number;
    if (!(simpsonD > 0 && simpsonD <= 1))
      simpleError(
        "simpsonD",
        "Simpson concentration must be greater than zero and at most one.",
      );
    return { simpsonReciprocal: 1 / simpsonD };
  },
});
export const runSimpsonReciprocal = simpsonReciprocalTool.execute;
export default simpsonReciprocalTool;
