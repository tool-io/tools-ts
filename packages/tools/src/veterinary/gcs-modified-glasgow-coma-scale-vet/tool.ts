import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, itemTotals } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyCodedItemScores: readonly number[];
  readonly itemKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyCodedItemScores",
    label: "Independently coded item scores",
    kind: "numberList",
  },
  { id: "itemKnownFlags", label: "Item known flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return itemTotals(
    input.independentlyCodedItemScores,
    input.itemKnownFlags,
    [6, 6, 6],
    [1, 1, 1],
    1,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyCodedItemScores: [2, 2, 2], itemKnownFlags: [1, 1, 1] },
  output: {
    result: {
      knownItemSum: 6,
      minimumPossibleTotal: 6,
      maximumPossibleTotal: 6,
      unknownItemIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/gcs-modified-glasgow-coma-scale-vet",
  title: "Modified Glasgow Coma Scale Vet Calculator",
  description:
    "VeterinarymodifiedGlasgowComaScaleindependently assessed motor, brainstemreflex, consciousness1\u20136codes;18maximum, human GCSnot interchangeable. Sum only independently assessed codes for the declared instrument/version; exact maxima [6, 6, 6] and minima [1, 1, 1]. Unknown items preserve possible total bounds without imputation. No questionnaire reproduction, clinical item assignment, norm, diagnosis, treatment or outcome prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
