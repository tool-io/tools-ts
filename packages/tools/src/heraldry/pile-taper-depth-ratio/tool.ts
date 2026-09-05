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
  readonly pileDepth: number;
  readonly fieldHeight: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pileDepth", label: "Pile depth", kind: "number" },
  { id: "fieldHeight", label: "Field height", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.fieldHeight, "fieldHeight");
  nonnegative(input.pileDepth, "pileDepth");
  if (input.pileDepth > input.fieldHeight)
    simpleError("dimension", "Observed extent fits reference envelope.");
  return { observedFraction: input.pileDepth / input.fieldHeight };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { pileDepth: 20, fieldHeight: 100 },
  output: { result: { observedFraction: 0.2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/pile-taper-depth-ratio",
  title: "Pile Taper Depth Ratio Calculator",
  description:
    "Pile axial depth fraction, not taper-angle or field-shape recognition.",
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
