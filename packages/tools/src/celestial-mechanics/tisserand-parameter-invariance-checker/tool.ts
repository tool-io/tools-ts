import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly initialT: number;
  readonly finalT: number;
  readonly callerTolerance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "initialT", label: "Initial t", kind: "number" },
  { id: "finalT", label: "Final t", kind: "number" },
  { id: "callerTolerance", label: "Caller tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.callerTolerance, "tolerance");
  return {
    withinCallerConservationTolerance:
      Math.abs(i.finalT - i.initialT) <= i.callerTolerance,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { initialT: 3, finalT: 3.01, callerTolerance: 0.02 },
  output: { result: { withinCallerConservationTolerance: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/tisserand-parameter-invariance-checker",
  title: "Tisserand Parameter Conservation Invariance Checker",
  description:
    "Absolute observed Tisserand departure versus caller tolerance; no claim exact invariance under omitted perturbations.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
