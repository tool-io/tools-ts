import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualRaySegmentLength: number;
  readonly callerActualMaximumRayStepLength: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRaySegmentLength",
    label: "Actual ray segment length",
    kind: "number",
  },
  {
    id: "callerActualMaximumRayStepLength",
    label: "Caller actual maximum ray step length",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualRaySegmentLength, "actualRaySegmentLength");
  positive(
    input.callerActualMaximumRayStepLength,
    "callerActualMaximumRayStepLength",
  );
  return {
    value: Math.ceil(
      input.actualRaySegmentLength / input.callerActualMaximumRayStepLength,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualRaySegmentLength: 10, callerActualMaximumRayStepLength: 2 },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/ray-marching-steps",
  title: "Ray Marching Steps Calculator",
  description:
    "Conditional integration step budget ceil(actual ray length/independent max step length), zero-length0, not selectedrendererquality or SDFhit guarantee.",
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
