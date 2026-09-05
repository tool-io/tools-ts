import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  binary,
  mean,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly armorialGulesPresenceFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "armorialGulesPresenceFlags",
    label: "Armorial gules presence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  binary(input.armorialGulesPresenceFlags, "armorialGulesPresenceFlags");
  if (!input.armorialGulesPresenceFlags.length)
    simpleError("roll", "Nonempty independently observed arms cohort.");
  return {
    armsContainingGulesPercent: 100 * mean(input.armorialGulesPresenceFlags),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { armorialGulesPresenceFlags: [1, 0, 1] },
  output: { result: { armsContainingGulesPercent: 66.66666666666667 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/gules-dominance-percent-roll",
  title: "Gules Dominance Percent in Roll Calculator",
  description:
    "Per-arm binary gules presence percentage, not tincture-occurrence or surface-area proportion.",
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
