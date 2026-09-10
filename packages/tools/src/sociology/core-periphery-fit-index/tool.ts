import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  graph,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedAdjacency: readonly (readonly number[])[];
  readonly callerCoreFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedAdjacency", label: "Observed adjacency", kind: "matrix" },
  { id: "callerCoreFlags", label: "Caller core flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const n = graph(input.observedAdjacency);
  aligned(input.observedAdjacency, input.callerCoreFlags, "core");
  binary(input.callerCoreFlags, "core");
  let agree = 0,
    total = 0;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) {
      total++;
      if (
        input.observedAdjacency[i][j] ===
        (input.callerCoreFlags[i] || input.callerCoreFlags[j] ? 1 : 0)
      )
        agree++;
    }
  return { observedIdealCorePeripheryAgreementFraction: agree / total };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedAdjacency: [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ],
    callerCoreFlags: [0, 1, 0],
  },
  output: { result: { observedIdealCorePeripheryAgreementFraction: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/core-periphery-fit-index",
  title: "Core-Periphery Fit Index Calculator",
  description:
    "Actual unweighted pair agreement with caller binary ideal:edge iff at least one endpoint core. Not optimize core assignment, universal core-periphery fit statistic or social status inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
