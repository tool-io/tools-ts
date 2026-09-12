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
  readonly actualSpeciesBasalArea: number;
  readonly actualAllSpeciesBasalArea: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSpeciesBasalArea",
    label: "Actual species basal area",
    kind: "number",
  },
  {
    id: "actualAllSpeciesBasalArea",
    label: "Actual all species basal area",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualSpeciesBasalArea, "actualSpeciesBasalArea");
  positive(input.actualAllSpeciesBasalArea, "actualAllSpeciesBasalArea");
  if (input.actualSpeciesBasalArea > input.actualAllSpeciesBasalArea)
    simpleError("totals", "Actualspeciesvalue≤matchedtotal.");
  return {
    value:
      (100 * input.actualSpeciesBasalArea) / input.actualAllSpeciesBasalArea,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualSpeciesBasalArea: 2, actualAllSpeciesBasalArea: 4 },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/relative-dominance",
  title: "Relative Dominance Calculator",
  description:
    "Actual Basal area relative dominance, matching plot population/units, not community causal importance.",
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
