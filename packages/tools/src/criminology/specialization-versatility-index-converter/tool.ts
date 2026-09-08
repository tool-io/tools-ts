import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sum, shares } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyClassifiedOffenseTypeCounts: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyClassifiedOffenseTypeCounts",
    label: "Independently classified offense type counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const p = shares(input.independentlyClassifiedOffenseTypeCounts),
    c = sum(p.map((v) => v * v));
  return { observedTypeConcentration: c, observedTypeVersatility: 1 - c };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyClassifiedOffenseTypeCounts: [2, 2] },
  output: {
    result: { observedTypeConcentration: 0.5, observedTypeVersatility: 0.5 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/specialization-versatility-index-converter",
  title: "Specialization Versatility Index Converter",
  description:
    "Actual offense-type concentration\u03a3p\u00b2and complement under independently declared exhaustive type categories. Not identity-based specialization, normalized diversity or future risk.",
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
