import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedMatBevelWidthMm: number;
  readonly observedMatBorderWidthMm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedMatBevelWidthMm",
    label: "Observed mat bevel width mm",
    kind: "number",
  },
  {
    id: "observedMatBorderWidthMm",
    label: "Observed mat border width mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.observedMatBevelWidthMm, "bevel");
  positive(input.observedMatBorderWidthMm, "border");
  return {
    observedBevelBorderFraction:
      input.observedMatBevelWidthMm / input.observedMatBorderWidthMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedMatBevelWidthMm: 5, observedMatBorderWidthMm: 50 },
  output: { result: { observedBevelBorderFraction: 0.1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/mat-bevel-width-proportion",
  title: "Framed Work Mat Bevel Width Proportion Calculator",
  description:
    "Actual mat-bevel/border width proportion, same measurement plane and units, not conservation compatibility, required style or glass/contact clearance.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
