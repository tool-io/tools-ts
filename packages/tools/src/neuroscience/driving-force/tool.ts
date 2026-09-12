import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualSignedMembranePotentialMv: number;
  readonly callerIndependentReversalPotentialMv: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSignedMembranePotentialMv",
    label: "Actual signed membrane potential mv",
    kind: "number",
  },
  {
    id: "callerIndependentReversalPotentialMv",
    label: "Caller independent reversal potential mv",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    value:
      input.actualSignedMembranePotentialMv -
      input.callerIndependentReversalPotentialMv,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSignedMembranePotentialMv: -60,
    callerIndependentReversalPotentialMv: -70,
  },
  output: { result: { value: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/driving-force",
  title: "Driving Force Calculator",
  description:
    "Signed membrane electrical driving force Vm\u2212Erev, not net Goldman potential or Nernstconcentrationmodel. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
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
