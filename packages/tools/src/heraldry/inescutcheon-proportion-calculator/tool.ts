import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly inescutcheonWidth: number;
  readonly outerShieldWidth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "inescutcheonWidth", label: "Inescutcheon width", kind: "number" },
  { id: "outerShieldWidth", label: "Outer shield width", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.outerShieldWidth, "outerShieldWidth");
  nonnegative(input.inescutcheonWidth, "inescutcheonWidth");
  if (input.inescutcheonWidth > input.outerShieldWidth)
    simpleError("dimension", "Observed extent fits reference envelope.");
  return { observedFraction: input.inescutcheonWidth / input.outerShieldWidth };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { inescutcheonWidth: 20, outerShieldWidth: 100 },
  output: { result: { observedFraction: 0.2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/inescutcheon-proportion-calculator",
  title: "Escutcheon of Pretence Size Proportion Calculator",
  description:
    "Observed escutcheon-of-pretence width fraction, not entitlement to bear it.",
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
