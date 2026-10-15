import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualSpeciesPlotFrequencySum: number;
  readonly actualAllSpeciesPlotFrequencySum: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualSpeciesPlotFrequencySum",
    label: "Actual species plot frequency sum",
    kind: "number",
  },
  {
    id: "actualAllSpeciesPlotFrequencySum",
    label: "Actual all species plot frequency sum",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.actualSpeciesPlotFrequencySum,
    "actualSpeciesPlotFrequencySum",
  );
  positive(
    input.actualAllSpeciesPlotFrequencySum,
    "actualAllSpeciesPlotFrequencySum",
  );
  if (
    input.actualSpeciesPlotFrequencySum > input.actualAllSpeciesPlotFrequencySum
  )
    simpleError("totals", "Actualspeciesvalue≤matchedtotal.");
  return {
    value:
      (100 * input.actualSpeciesPlotFrequencySum) /
      input.actualAllSpeciesPlotFrequencySum,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSpeciesPlotFrequencySum: 2,
    actualAllSpeciesPlotFrequencySum: 4,
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/relative-frequency",
  title: "Relative Frequency Calculator",
  description:
    "Actual Species relative frequency divided by SUM frequencies, not absolute plot occurrence percentage, matching plot population/units, not community causal importance.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
