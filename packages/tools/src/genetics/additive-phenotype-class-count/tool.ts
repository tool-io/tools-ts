import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly equalEffectLocusCount: number;
}>;
export type Output = Readonly<{
  readonly expectedPhenotypeClasses: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.equalEffectLocusCount, "equalEffectLocusCount", 1);
  return { expectedPhenotypeClasses: 2 * input.equalEffectLocusCount + 1 };
};
export const exampleInput = { equalEffectLocusCount: 3 } satisfies Input;
export const exampleOutput = { expectedPhenotypeClasses: 7 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/additive-phenotype-class-count",
  title: "Additive Phenotype Class Count",
  description:
    "Count equal-effect additive phenotype classes under a fully segregating diploid locus model.",
  inputs: [
    {
      id: "equalEffectLocusCount",
      label: "Equal effect locus count",
      kind: "integer",
    },
  ],
  outputs: [
    {
      id: "expectedPhenotypeClasses",
      label: "Expected phenotype classes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      equalEffectLocusCount: value.equalEffectLocusCount as number,
    }),
});
export const run = tool.execute;
export default tool;
