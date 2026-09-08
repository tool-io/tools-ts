import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly hoist: number;
  readonly callerVerifiedHorizonYFraction: number;
  readonly callerVerifiedDiscCenterYFraction: number;
  readonly discRadius: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "hoist", label: "Hoist", kind: "number" },
  {
    id: "callerVerifiedHorizonYFraction",
    label: "Caller verified horizon y fraction",
    kind: "number",
  },
  {
    id: "callerVerifiedDiscCenterYFraction",
    label: "Caller verified disc center y fraction",
    kind: "number",
  },
  { id: "discRadius", label: "Disc radius", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.hoist, "hoist");
  positive(input.discRadius, "discRadius");
  fraction(
    input.callerVerifiedHorizonYFraction,
    "callerVerifiedHorizonYFraction",
  );
  fraction(
    input.callerVerifiedDiscCenterYFraction,
    "callerVerifiedDiscCenterYFraction",
  );
  const horizon = input.hoist * input.callerVerifiedHorizonYFraction,
    center = input.hoist * input.callerVerifiedDiscCenterYFraction,
    q = (horizon - center) / input.discRadius,
    t = Math.max(-1, Math.min(1, q)),
    visible =
      input.discRadius ** 2 *
      (Math.acos(-t) + t * Math.sqrt(Math.max(0, 1 - t * t)));
  return {
    horizonY: horizon,
    discCenterY: center,
    signedCenterToHorizonOffset: center - horizon,
    visibleDiscArea: visible,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    hoist: 100,
    callerVerifiedHorizonYFraction: 0.8,
    callerVerifiedDiscCenterYFraction: 0.7,
    discRadius: 20,
  },
  output: {
    result: {
      horizonY: 80,
      discCenterY: 70,
      signedCenterToHorizonOffset: -10,
      visibleDiscArea: 1010.9631217141658,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/rising-sun-offset",
  title: "Rising Sun Disc Offset Calculator",
  description:
    "Rising-sun disc actual center/horizon offset and ideal circular area above horizontal horizon in top-left y-down frame. Caller independently specifies design fractions/radius; cap clips only at horizon, not rectangular flag sides or rays and no national proportion inferred.",
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
