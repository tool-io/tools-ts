import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyEstablishedTargetSynapticResponse: number;
  readonly actualMatchedCurrentSynapticResponse: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyEstablishedTargetSynapticResponse",
    label: "Caller independently established target synaptic response",
    kind: "number",
  },
  {
    id: "actualMatchedCurrentSynapticResponse",
    label: "Actual matched current synaptic response",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerIndependentlyEstablishedTargetSynapticResponse,
    "callerIndependentlyEstablishedTargetSynapticResponse",
  );
  positive(
    input.actualMatchedCurrentSynapticResponse,
    "actualMatchedCurrentSynapticResponse",
  );
  return {
    value:
      (1 * input.callerIndependentlyEstablishedTargetSynapticResponse) /
      input.actualMatchedCurrentSynapticResponse,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyEstablishedTargetSynapticResponse: 2,
    actualMatchedCurrentSynapticResponse: 4,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/homeostatic-scaling-factor",
  title: "Homeostatic Scaling Factor Calculator",
  description:
    "Conditional target/current global homeostatic scaling factor, not generate a biologically validated target or intervention; actual compatible definitions and matching units required, no causal efficacy/diagnosis or safety claim.",
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
