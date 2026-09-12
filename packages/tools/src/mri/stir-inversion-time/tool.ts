import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerIndependentFatT1Milliseconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentFatT1Milliseconds",
    label: "Caller independent fat t1 milliseconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerIndependentFatT1Milliseconds,
    "callerIndependentFatT1Milliseconds",
  );
  return { value: input.callerIndependentFatT1Milliseconds * Math.LN2 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerIndependentFatT1Milliseconds: 200 },
  output: { result: { value: 138.62943611198907 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/stir-inversion-time",
  title: "STIR Inversion Time Calculator",
  description:
    "Ideal180degreefullrecoverySTIR fat null TI=T1ln2, actualfatT1independent, finiteTR/non ideal flip correction omitted; not recommendedscanTIor diagnosis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
