import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredLiveStemCount: number;
  readonly actualSampledPlotAreaHectares: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredLiveStemCount",
    label: "Actual measured live stem count",
    kind: "number",
  },
  {
    id: "actualSampledPlotAreaHectares",
    label: "Actual sampled plot area hectares",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualMeasuredLiveStemCount,
    "actualMeasuredLiveStemCount",
    0,
    1000000,
  );
  positive(
    input.actualSampledPlotAreaHectares,
    "actualSampledPlotAreaHectares",
  );
  return {
    value:
      input.actualMeasuredLiveStemCount / input.actualSampledPlotAreaHectares,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualMeasuredLiveStemCount: 10, actualSampledPlotAreaHectares: 2 },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/density-stems-per-hectare",
  title: "Stems Per Hectare Density Calculator",
  description:
    "Actual independently qualifying live-stem count per actual sampled hectare, no Rein eke normalization or assumed full plot census.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
