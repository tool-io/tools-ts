import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  deg,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly hoist: number;
  readonly fly: number;
  readonly verifiedArmFractionOfHoist: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "hoist", label: "Hoist", kind: "number" },
  { id: "fly", label: "Fly", kind: "number" },
  {
    id: "verifiedArmFractionOfHoist",
    label: "Verified arm fraction of hoist",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.hoist, "hoist");
  positive(input.fly, "fly");
  fraction(input.verifiedArmFractionOfHoist, "verifiedArmFractionOfHoist");
  return {
    perpendicularArmWidth: input.hoist * input.verifiedArmFractionOfHoist,
    saltireAngleDegrees: deg(Math.atan2(input.hoist, input.fly)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { hoist: 100, fly: 200, verifiedArmFractionOfHoist: 0.1 },
  output: {
    result: {
      perpendicularArmWidth: 10,
      saltireAngleDegrees: 26.56505117707799,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/saltire-arm-width",
  title: "Saltire Arm Width Proportion Solver",
  description:
    "Saltire diagonal centerline angle and verified perpendicular arm width on actual aspect ratio, not force45 degrees or assume a national spec.",
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
