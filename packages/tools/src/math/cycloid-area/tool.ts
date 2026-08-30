import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  bounded,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly rollingCircleRadius: number;
  readonly completeArchCount: number;
}>;
export type Output = Readonly<{
  readonly areaUnderCompleteCycloidArches: number;
}>;
const inputFields = [
  { id: "rollingCircleRadius", label: "Rolling circle radius", kind: "number" },
  { id: "completeArchCount", label: "Complete arch count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.rollingCircleRadius, "rollingCircleRadius");
  count(input.completeArchCount, "completeArchCount");
  bounded(input.completeArchCount, "completeArchCount", 0, 1000000);
  return {
    areaUnderCompleteCycloidArches:
      3 * Math.PI * input.rollingCircleRadius ** 2 * input.completeArchCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rollingCircleRadius: 2,
  completeArchCount: 3,
} satisfies Input;
export const exampleOutput = {
  areaUnderCompleteCycloidArches: 113.09733552923255,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/cycloid-area",
  title: "Cycloid Area Calculator",
  description:
    "Compute planar area between baseline and whole ordinary cycloid arches from rolling-circle radius; not curtate/prolate trochoids or arbitrary incomplete arcs.",
  inputs: inputFields,
  outputs: [
    {
      id: "areaUnderCompleteCycloidArches",
      label: "Area under complete cycloid arches",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      rollingCircleRadius: value.rollingCircleRadius as number,
      completeArchCount: value.completeArchCount as number,
    }),
});
export const run = tool.execute;
export default tool;
