import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const hillN2Example = {
  input: { simpsonConcentrationD: 0.25 },
  output: { hillN2: 4 },
} satisfies ToolExample<
  { readonly simpsonConcentrationD: number },
  { readonly hillN2: number }
>;

export const hillN2Tool = createSimpleTool({
  id: "biology/diversity-hill-n2",
  title: "Hill Number N2",
  description:
    "Convert a Simpson concentration to the Hill number of order two as its reciprocal.",
  inputs: [
    {
      id: "simpsonConcentrationD",
      label: "Simpson concentration",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "hillN2",
      label: "Hill number N2",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const simpsonConcentrationD = input.simpsonConcentrationD as number;
    if (!(simpsonConcentrationD > 0 && simpsonConcentrationD <= 1))
      simpleError(
        "simpsonConcentrationD",
        "Simpson concentration must be greater than zero and at most one.",
      );
    return { hillN2: 1 / simpsonConcentrationD };
  },
});
export const runHillN2 = hillN2Tool.execute;
export default hillN2Tool;
