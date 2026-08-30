import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly nominalMassDa: number;
  readonly exactMassDa: number;
}>;
export type Output = Readonly<{
  readonly nominalMinusExactDa: number;
  readonly sign: string;
}>;
export const calculate = (input: Input): Output => {
  if (input.nominalMassDa <= 0 || input.exactMassDa <= 0)
    simpleError("nominalMassDa", "Positive nominal and exact masses required.");
  const nominalMinusExactDa = input.nominalMassDa - input.exactMassDa;
  return {
    nominalMinusExactDa,
    sign:
      nominalMinusExactDa > 0
        ? "positive"
        : nominalMinusExactDa < 0
          ? "negative"
          : "zero",
  };
};
export const exampleInput = {
  nominalMassDa: 100,
  exactMassDa: 100.1,
} satisfies Input;
export const exampleOutput = {
  nominalMinusExactDa: -0.09999999999999432,
  sign: "negative",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/nominal-mass-defect",
  title: "Nominal Mass Defect",
  description: "Determine signed nominal-minus-exact molecular mass defect.",
  inputs: [
    { id: "nominalMassDa", kind: "number", label: "Nominal mass da" },
    { id: "exactMassDa", kind: "number", label: "Exact mass da" },
  ],
  outputs: [
    {
      id: "nominalMinusExactDa",
      kind: "number",
      label: "Nominal minus exact da",
    },
    { id: "sign", kind: "string", label: "Sign" },
  ],
  calculate: (value) =>
    calculate({
      nominalMassDa: value.nominalMassDa as number,
      exactMassDa: value.exactMassDa as number,
    }),
});
export const run = tool.execute;
export default tool;
