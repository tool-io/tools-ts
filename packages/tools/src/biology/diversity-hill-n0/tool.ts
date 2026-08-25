import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const hillN0Example = {
  input: { speciesCountInt: 12 },
  output: { hillN0: 12 },
} satisfies ToolExample<
  { readonly speciesCountInt: number },
  { readonly hillN0: number }
>;

export const hillN0Tool = createSimpleTool({
  id: "biology/diversity-hill-n0",
  title: "Hill Number N0",
  description:
    "Return the Hill number of order zero, which equals species richness and therefore passes the species count through unchanged.",
  inputs: [
    {
      id: "speciesCountInt",
      label: "Species count",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "hillN0",
      label: "Hill number N0",
      kind: "integer",
    },
  ],
  calculate: (input) => ({ hillN0: input.speciesCountInt as number }),
});
export const runHillN0 = hillN0Tool.execute;
export default hillN0Tool;
