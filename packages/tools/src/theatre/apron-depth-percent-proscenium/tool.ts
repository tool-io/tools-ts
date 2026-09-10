import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedApronDepthMeters: number;
  readonly observedProsceniumOpeningHeightMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedApronDepthMeters",
    label: "Observed apron depth meters",
    kind: "number",
  },
  {
    id: "observedProsceniumOpeningHeightMeters",
    label: "Observed proscenium opening height meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.observedApronDepthMeters, "depth");
  positive(input.observedProsceniumOpeningHeightMeters, "height");
  return {
    observedApronDepthHeightPercent:
      (100 * input.observedApronDepthMeters) /
      input.observedProsceniumOpeningHeightMeters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedApronDepthMeters: 2,
    observedProsceniumOpeningHeightMeters: 8,
  },
  output: { result: { observedApronDepthHeightPercent: 25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/apron-depth-percent-proscenium",
  title: "Apron Depth Percent Proscenium Calculator",
  description:
    "Actual apron depth as a percentage of explicitly chosen proscenium HEIGHT, same-unit matched measurement. Not use width implicitly or assess safe layout.",
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
