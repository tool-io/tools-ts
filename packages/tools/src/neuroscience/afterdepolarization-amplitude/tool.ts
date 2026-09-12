import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualObservedPostSpikeDepolarizedMv: number;
  readonly callerQualifiedReferenceBaselineMv: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedPostSpikeDepolarizedMv",
    label: "Actual observed post spike depolarized mv",
    kind: "number",
  },
  {
    id: "callerQualifiedReferenceBaselineMv",
    label: "Caller qualified reference baseline mv",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    value:
      input.actualObservedPostSpikeDepolarizedMv -
      input.callerQualifiedReferenceBaselineMv,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualObservedPostSpikeDepolarizedMv: 5,
    callerQualifiedReferenceBaselineMv: 3,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/afterdepolarization-amplitude",
  title: "Afterdepolarization Amplitude Calculator",
  description:
    "Signed actual afterdepolarization amplitude vs baseline; signed result retained, actual matching units and definitions independently established.",
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
