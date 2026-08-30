import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  maximum,
} from "../shared.js";
export type Input = Readonly<{
  readonly diagnosticElementCounts: readonly number[];
  readonly availableCopiesPerIndividual: readonly number[];
}>;
export type Output = Readonly<{
  readonly elementIndividualLowerBounds: readonly number[];
  readonly assemblageMinimumIndividuals: number;
}>;
const inputFields = [
  {
    id: "diagnosticElementCounts",
    label: "Diagnostic element counts",
    kind: "numberList",
  },
  {
    id: "availableCopiesPerIndividual",
    label: "Available copies per individual",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.availableCopiesPerIndividual.forEach((v) =>
    positive(v, "availableCopiesPerIndividual"),
  );
  input.diagnosticElementCounts.forEach((v) =>
    count(v, "diagnosticElementCounts"),
  );
  input.availableCopiesPerIndividual.forEach((v) =>
    count(v, "availableCopiesPerIndividual"),
  );
  aligned(
    input.diagnosticElementCounts,
    input.availableCopiesPerIndividual,
    "diagnosticElementCounts",
  );
  const elementIndividualLowerBounds = input.diagnosticElementCounts.map(
    (v, i) => Math.ceil(v / input.availableCopiesPerIndividual[i]),
  );
  return {
    elementIndividualLowerBounds,
    assemblageMinimumIndividuals: maximum(elementIndividualLowerBounds),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  diagnosticElementCounts: [3, 5, 2],
  availableCopiesPerIndividual: [1, 2, 1],
} satisfies Input;
export const exampleOutput = {
  elementIndividualLowerBounds: [3, 3, 2],
  assemblageMinimumIndividuals: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/mni-minimum-individuals-from-elements",
  title: "MNI From Elements",
  description:
    "Take maximum element-specific individual lower bounds from caller nonduplicated age/side/diagnostic strata; MNI depends on pooling and identified copies, not raw fragmented NISP.",
  inputs: inputFields,
  outputs: [
    {
      id: "elementIndividualLowerBounds",
      label: "Element individual lower bounds",
      kind: "numberList",
    },
    {
      id: "assemblageMinimumIndividuals",
      label: "Assemblage minimum individuals",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      diagnosticElementCounts:
        value.diagnosticElementCounts as readonly number[],
      availableCopiesPerIndividual:
        value.availableCopiesPerIndividual as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
