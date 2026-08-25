import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const hillN1Example = {
  input: { shannonNaturalH: 1.3862943611198906 },
  output: { hillN1: 4 },
} satisfies ToolExample<
  { readonly shannonNaturalH: number },
  { readonly hillN1: number }
>;

export const hillN1Tool = createSimpleTool({
  id: "biology/diversity-hill-n1",
  title: "Hill Number N1",
  description:
    "Convert a natural-log Shannon entropy to the Hill number of order one, the effective number of equally common species, as exp(H).",
  inputs: [
    {
      id: "shannonNaturalH",
      label: "Shannon entropy",
      description: "Shannon diversity index in natural logarithm units.",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "hillN1",
      label: "Hill number N1",
      kind: "number",
    },
  ],
  calculate: (input) => ({
    hillN1: Math.exp(input.shannonNaturalH as number),
  }),
});
export const runHillN1 = hillN1Tool.execute;
export default hillN1Tool;
