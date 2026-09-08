import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly columnSpacing: number;
  readonly evenRowFirstCenterX: number;
  readonly oddRowFirstCenterX: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "columnSpacing", label: "Column spacing", kind: "number" },
  {
    id: "evenRowFirstCenterX",
    label: "Even row first center x",
    kind: "number",
  },
  { id: "oddRowFirstCenterX", label: "Odd row first center x", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.columnSpacing, "columnSpacing");
  return {
    signedStaggerOffset: input.oddRowFirstCenterX - input.evenRowFirstCenterX,
    staggerAsColumnFraction:
      (input.oddRowFirstCenterX - input.evenRowFirstCenterX) /
      input.columnSpacing,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { columnSpacing: 20, evenRowFirstCenterX: 10, oddRowFirstCenterX: 20 },
  output: { result: { signedStaggerOffset: 10, staggerAsColumnFraction: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/staggered-star-offset",
  title: "Staggered Star Row Offset Calculator",
  description:
    "Measure actual alternating star-row stagger rather than assume half-spacing or official layout.",
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
