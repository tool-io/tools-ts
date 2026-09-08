import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction, canvas } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly fly: number;
  readonly hoist: number;
  readonly callerVerifiedJunctionXFraction: number;
  readonly callerVerifiedJunctionYFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fly", label: "Fly", kind: "number" },
  { id: "hoist", label: "Hoist", kind: "number" },
  {
    id: "callerVerifiedJunctionXFraction",
    label: "Caller verified junction x fraction",
    kind: "number",
  },
  {
    id: "callerVerifiedJunctionYFraction",
    label: "Caller verified junction y fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  canvas(input.fly, input.hoist);
  fraction(input.callerVerifiedJunctionXFraction, "x");
  fraction(input.callerVerifiedJunctionYFraction, "y");
  const x = input.fly * input.callerVerifiedJunctionXFraction,
    y = input.hoist * input.callerVerifiedJunctionYFraction;
  return {
    junction: [x, y],
    viewerLeftUpperRay: [[-x, -y]],
    viewerLeftLowerRay: [[-x, input.hoist - y]],
    viewerRightRay: [[input.fly - x, input.hoist / 2 - y]],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    fly: 200,
    hoist: 100,
    callerVerifiedJunctionXFraction: 0.4,
    callerVerifiedJunctionYFraction: 0.5,
  },
  output: {
    result: {
      junction: [80, 50],
      viewerLeftUpperRay: [[-80, -50]],
      viewerLeftLowerRay: [[-80, 50]],
      viewerRightRay: [[120, 0]],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/pall-intersection-point",
  title: "Pall Y-Arm Intersection Point Solver",
  description:
    "PallYcenterline junction from verified normalized specification with vectors to hoist corners and fly midpoint; not equal-angle/arm-width clipping.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
