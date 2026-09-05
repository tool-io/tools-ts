import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly annotatedMetalOccurrences: number;
  readonly annotatedColourOccurrences: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "annotatedMetalOccurrences",
    label: "Annotated metal occurrences",
    kind: "number",
  },
  {
    id: "annotatedColourOccurrences",
    label: "Annotated colour occurrences",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.annotatedColourOccurrences, "annotatedColourOccurrences");
  nonnegative(input.annotatedMetalOccurrences, "annotatedMetalOccurrences");
  integer(input.annotatedMetalOccurrences, "metals");
  integer(input.annotatedColourOccurrences, "colours");
  return {
    metalToColourRatio:
      input.annotatedMetalOccurrences / input.annotatedColourOccurrences,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { annotatedMetalOccurrences: 6, annotatedColourOccurrences: 4 },
  output: { result: { metalToColourRatio: 1.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/metals-colours-ratio-set",
  title: "Metals-to-Colours Usage Ratio Calculator for Arms Set",
  description:
    "Compare independently annotated same-basis metal/colour occurrence counts, excludes proper/fur/unclassified denominator.",
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
