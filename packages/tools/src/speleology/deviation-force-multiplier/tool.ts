import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualTravelDeflectionAngleDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTravelDeflectionAngleDegrees",
    label: "Actual travel deflection angle degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.actualTravelDeflectionAngleDegrees < 0 ||
    input.actualTravelDeflectionAngleDegrees > 180
  )
    simpleError("deflection", "Explicit 0–180travel-direction change.");
  return {
    conditionalEqualTensionRedirectResultantMultiplier:
      2 * Math.sin((input.actualTravelDeflectionAngleDegrees * Math.PI) / 360),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualTravelDeflectionAngleDegrees: 90 },
  output: {
    result: {
      conditionalEqualTensionRedirectResultantMultiplier: 1.4142135623730951,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/deviation-force-multiplier",
  title: "Deviation Redirect Angle Force Multiplier Calculator",
  description:
    "Ideal equal-tension redirect resultant/T=2sin(travel-deflection/2),0straight-through,180reversal. Not Vanchorleg tension, friction, dynamic force or anchor/equipment rating.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
