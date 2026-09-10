import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedGridHeightMeters: number;
  readonly observedProsceniumHeightMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedGridHeightMeters",
    label: "Observed grid height meters",
    kind: "number",
  },
  {
    id: "observedProsceniumHeightMeters",
    label: "Observed proscenium height meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.observedGridHeightMeters, "grid");
  positive(input.observedProsceniumHeightMeters, "opening");
  return {
    observedGridOpeningHeightRatio:
      input.observedGridHeightMeters / input.observedProsceniumHeightMeters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedGridHeightMeters: 12, observedProsceniumHeightMeters: 6 },
  output: { result: { observedGridOpeningHeightRatio: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/grid-height-to-proscenium-ratio",
  title: "Grid Height To Proscenium Ratio Calculator",
  description:
    "Actual grid-height/opening-height geometric ratio, not fly-space adequacy or engineered clearance.",
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
