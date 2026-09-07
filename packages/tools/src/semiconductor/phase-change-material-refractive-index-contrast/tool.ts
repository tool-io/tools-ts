import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, points } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedAmorphousComplexIndex: readonly (readonly number[])[];
  readonly observedCrystallineComplexIndex: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly signedComplexIndexContrasts: readonly (readonly number[])[];
  readonly complexContrastMagnitudes: readonly number[];
}>;
const inputFields = [
  {
    id: "observedAmorphousComplexIndex",
    label: "Observed amorphous complex index",
    kind: "matrix",
  },
  {
    id: "observedCrystallineComplexIndex",
    label: "Observed crystalline complex index",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  points(input.observedAmorphousComplexIndex);
  points(input.observedCrystallineComplexIndex);
  aligned(
    input.observedAmorphousComplexIndex,
    input.observedCrystallineComplexIndex,
    "indices",
  );
  const delta = input.observedCrystallineComplexIndex.map((r, i) =>
    r.map((v, j) => v - input.observedAmorphousComplexIndex[i][j]),
  );
  return {
    signedComplexIndexContrasts: delta,
    complexContrastMagnitudes: delta.map((r) => Math.hypot(...r)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAmorphousComplexIndex: [
    [2, 0.1],
    [3, 0.2],
  ],
  observedCrystallineComplexIndex: [
    [4, 0.2],
    [2, 0.1],
  ],
} satisfies Input;
export const exampleOutput = {
  signedComplexIndexContrasts: [
    [2, 0.1],
    [-1, -0.1],
  ],
  complexContrastMagnitudes: [2.0024984394500787, 1.004987562112089],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/phase-change-material-refractive-index-contrast",
  title:
    "Semiconductor Phase Change Material Refractive Index Contrast Calculator",
  description:
    "Audit actual matched complex crystalline-minus-amorphous optical indices, preserving real/imaginary changes separately; not real-only material index lookup.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedComplexIndexContrasts",
      label: "Signed complex index contrasts",
      kind: "matrix",
    },
    {
      id: "complexContrastMagnitudes",
      label: "Complex contrast magnitudes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAmorphousComplexIndex:
        value.observedAmorphousComplexIndex as readonly (readonly number[])[],
      observedCrystallineComplexIndex:
        value.observedCrystallineComplexIndex as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
