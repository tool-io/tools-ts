import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  maximum,
  shape,
} from "../shared.js";
export type Input = Readonly<{
  readonly diagnosticLandmarkCountsByElement: readonly (readonly number[])[];
  readonly nispCountsByElement: readonly number[];
}>;
export type Output = Readonly<{
  readonly minimumElementCounts: readonly number[];
  readonly totalMne: number;
  readonly totalNisp: number;
  readonly nispPerMne: number;
}>;
const inputFields = [
  {
    id: "diagnosticLandmarkCountsByElement",
    label: "Diagnostic landmark counts by element",
    kind: "matrix",
  },
  {
    id: "nispCountsByElement",
    label: "Nisp counts by element",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.nispCountsByElement.forEach((v) => count(v, "nispCountsByElement"));
  shape(
    input.diagnosticLandmarkCountsByElement,
    "diagnosticLandmarkCountsByElement",
  );
  aligned(
    input.diagnosticLandmarkCountsByElement,
    input.nispCountsByElement,
    "elements",
  );
  const minimumElementCounts = input.diagnosticLandmarkCountsByElement.map(
      (row, i) => {
        row.forEach((v) => count(v, "landmarks"));
        const m = maximum(row);
        if (m > input.nispCountsByElement[i])
          simpleError(
            "nispCountsByElement",
            "Landmark multiplicity cannot exceed specimen count.",
          );
        return m;
      },
    ),
    totalMne = positive(
      minimumElementCounts.reduce((a, b) => a + b, 0),
      "landmarks",
    ),
    totalNisp = input.nispCountsByElement.reduce((a, b) => a + b, 0);
  return {
    minimumElementCounts,
    totalMne,
    totalNisp,
    nispPerMne: totalNisp / totalMne,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  diagnosticLandmarkCountsByElement: [
    [2, 3],
    [4, 1],
  ],
  nispCountsByElement: [5, 6],
} satisfies Input;
export const exampleOutput = {
  minimumElementCounts: [3, 4],
  totalMne: 7,
  totalNisp: 11,
  nispPerMne: 1.5714285714285714,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/nisp-to-mne",
  title: "NISP to MNE Conversion",
  description:
    "Infer minimum elements as maximum diagnostic landmark multiplicity within caller matched element/side groups, then compare NISP; fragments are not directly divided by a universal conversion factor.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumElementCounts",
      label: "Minimum element counts",
      kind: "numberList",
    },
    { id: "totalMne", label: "Total mne", kind: "number" },
    { id: "totalNisp", label: "Total nisp", kind: "number" },
    { id: "nispPerMne", label: "Nisp per mne", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      diagnosticLandmarkCountsByElement:
        value.diagnosticLandmarkCountsByElement as readonly (readonly number[])[],
      nispCountsByElement: value.nispCountsByElement as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
