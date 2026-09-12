import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyQualifiedSimultaneousFdcInletFlowsGpm: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyQualifiedSimultaneousFdcInletFlowsGpm",
    label: "Actual independently qualified simultaneous fdc inlet flows gpm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualIndependentlyQualifiedSimultaneousFdcInletFlowsGpm.length)
    simpleError(
      "actualIndependentlyQualifiedSimultaneousFdcInletFlowsGpm",
      "Actual nonempty observations.",
    );
  input.actualIndependentlyQualifiedSimultaneousFdcInletFlowsGpm.forEach((v) =>
    nonnegative(v, "actualIndependentlyQualifiedSimultaneousFdcInletFlowsGpm"),
  );
  return {
    value: sum(input.actualIndependentlyQualifiedSimultaneousFdcInletFlowsGpm),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualIndependentlyQualifiedSimultaneousFdcInletFlowsGpm: [10, 20] },
  output: { result: { value: 30 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/fire-department-connection-flow",
  title: "Plumbing Fire Department Connection Flow Calculator",
  description:
    "Actual independently qualified simultaneously delivering FDC inlet flows sum, not derive available fire flow from connector count or sprinklerK. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
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
