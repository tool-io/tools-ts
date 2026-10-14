import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly baselineForceN: number;
  readonly callerVerifiedFrictionMultiplier: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "baselineForceN", label: "Baseline force n", kind: "number" },
  {
    id: "callerVerifiedFrictionMultiplier",
    label: "Caller verified friction multiplier",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.baselineForceN, "force");
  positive(i.callerVerifiedFrictionMultiplier, "factor");
  return {
    conditionalAdjustedForceN:
      i.baselineForceN * i.callerVerifiedFrictionMultiplier,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { baselineForceN: 10, callerVerifiedFrictionMultiplier: 1.5 },
  output: { result: { conditionalAdjustedForceN: 15 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/hal-friction-multiplier-calculator",
  title: "Moore-Garg HAL Friction Multiplier Calculator",
  description:
    "Conditional force adjustment with caller independently verified friction coefficient; not a canonical Moore-Garg HAL friction formula or risk score.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalAdjustedForceN: { type: "number" } },
        required: ["conditionalAdjustedForceN"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
