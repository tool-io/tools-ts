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
export type Output = Readonly<{ readonly completeCycloidArcLength: number }>;
const inputFields = [
  { id: "rollingCircleRadius", label: "Rolling circle radius", kind: "number" },
  { id: "completeArchCount", label: "Complete arch count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.rollingCircleRadius, "rollingCircleRadius");
  count(input.completeArchCount, "completeArchCount");
  bounded(input.completeArchCount, "completeArchCount", 0, 1000000);
  return {
    completeCycloidArcLength:
      8 * input.rollingCircleRadius * input.completeArchCount,
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
export const exampleOutput = { completeCycloidArcLength: 48 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/cycloid-arc-length",
  title: "Cycloid Arc Length Calculator",
  description:
    "Compute exact full ordinary cycloid arch length (eight radii per arch); does not apply to incomplete or altered trochoid trajectories.",
  inputs: inputFields,
  outputs: [
    {
      id: "completeCycloidArcLength",
      label: "Complete cycloid arc length",
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
