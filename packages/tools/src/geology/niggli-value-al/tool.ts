import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyComputedAlEquivalentMoles: number;
  readonly independentlyComputedFmEquivalentMoles: number;
  readonly independentlyComputedCaEquivalentMoles: number;
  readonly independentlyComputedAlkEquivalentMoles: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyComputedAlEquivalentMoles",
    label: "Independently computed al equivalent moles",
    kind: "number",
  },
  {
    id: "independentlyComputedFmEquivalentMoles",
    label: "Independently computed fm equivalent moles",
    kind: "number",
  },
  {
    id: "independentlyComputedCaEquivalentMoles",
    label: "Independently computed ca equivalent moles",
    kind: "number",
  },
  {
    id: "independentlyComputedAlkEquivalentMoles",
    label: "Independently computed alk equivalent moles",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const values = [
    input.independentlyComputedAlEquivalentMoles,
    input.independentlyComputedFmEquivalentMoles,
    input.independentlyComputedCaEquivalentMoles,
    input.independentlyComputedAlkEquivalentMoles,
  ];
  values.forEach((v) => nonnegative(v, "groupmoles"));
  const t = positive(sum(values), "totalgroupmoles");
  return {
    conditionalNiggliValue:
      (100 * input.independentlyComputedAlEquivalentMoles) / t,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyComputedAlEquivalentMoles: 1,
    independentlyComputedFmEquivalentMoles: 2,
    independentlyComputedCaEquivalentMoles: 3,
    independentlyComputedAlkEquivalentMoles: 4,
  },
  output: { result: { conditionalNiggliValue: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/niggli-value-al",
  title: "Geology Niggli Value Al Calculator",
  description:
    "Declared Niggli al=100group-equivalent moles/\u03a3(al+fm+c+alk). Oxide molar conversions, Feoxidation and grouping independently performed under actual Niggliconvention; not raw wt%normalization or full Niggli mineral analysis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
