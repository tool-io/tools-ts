import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualWorkingReactorVolume: number;
  readonly actualVolumetricThroughput: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualWorkingReactorVolume",
    label: "Actual working reactor volume",
    kind: "number",
  },
  {
    id: "actualVolumetricThroughput",
    label: "Actual volumetric throughput",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualWorkingReactorVolume, "actualWorkingReactorVolume");
  positive(input.actualVolumetricThroughput, "actualVolumetricThroughput");
  return {
    value: input.actualWorkingReactorVolume / input.actualVolumetricThroughput,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualWorkingReactorVolume: 10, actualVolumetricThroughput: 2 },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/cstr-residence-time",
  title: "CSTR Residence Time Calculator",
  description:
    "Nominal CSTR space/residence timeV/Q, actual steady incompressible matched throughput; not residence-time distribution or reaction conversion. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
