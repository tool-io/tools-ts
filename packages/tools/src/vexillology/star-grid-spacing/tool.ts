import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly availableCantonHeight: number;
  readonly starRows: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "availableCantonHeight",
    label: "Available canton height",
    kind: "number",
  },
  { id: "starRows", label: "Star rows", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.availableCantonHeight, "availableCantonHeight");
  bounded(input.starRows, "rows", 1, 64);
  return {
    equalCellCenterY: Array.from(
      { length: input.starRows },
      (_, i) => ((i + 0.5) * input.availableCantonHeight) / input.starRows,
    ),
    rowSpacing: input.availableCantonHeight / input.starRows,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { availableCantonHeight: 100, starRows: 5 },
  output: {
    result: { equalCellCenterY: [10, 30, 50, 70, 90], rowSpacing: 20 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/star-grid-spacing",
  title: "Star Grid Row Spacing Calculator",
  description:
    "Equal-cell star-row centers inside explicit canton height with half-cell edge margins, not an official national star layout.",
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
