import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly stainedPixelCounts: readonly number[];
  readonly observableBonePixelCounts: readonly number[];
  readonly pixelAreasMm2: readonly number[];
}>;
export type Output = Readonly<{
  readonly perSpecimenStainedCoveragePercent: readonly number[];
  readonly pooledPhysicalAreaStainedCoveragePercent: number;
}>;
const inputFields = [
  {
    id: "stainedPixelCounts",
    label: "Stained pixel counts",
    kind: "numberList",
  },
  {
    id: "observableBonePixelCounts",
    label: "Observable bone pixel counts",
    kind: "numberList",
  },
  { id: "pixelAreasMm2", label: "Pixel areas mm2", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observableBonePixelCounts.forEach((v) =>
    positive(v, "observableBonePixelCounts"),
  );
  input.pixelAreasMm2.forEach((v) => positive(v, "pixelAreasMm2"));
  input.stainedPixelCounts.forEach((v) => count(v, "stainedPixelCounts"));
  input.observableBonePixelCounts.forEach((v) =>
    count(v, "observableBonePixelCounts"),
  );
  aligned(
    input.stainedPixelCounts,
    input.observableBonePixelCounts,
    "stainedPixelCounts",
  );
  aligned(input.stainedPixelCounts, input.pixelAreasMm2, "stainedPixelCounts");
  if (
    input.stainedPixelCounts.some(
      (v, i) => v > input.observableBonePixelCounts[i],
    )
  )
    simpleError(
      "stainedPixelCounts",
      "Stained pixels cannot exceed observable bone mask.",
    );
  return {
    perSpecimenStainedCoveragePercent: input.stainedPixelCounts.map(
      (v, i) => (100 * v) / input.observableBonePixelCounts[i],
    ),
    pooledPhysicalAreaStainedCoveragePercent:
      (100 *
        input.stainedPixelCounts.reduce(
          (s, v, i) => s + v * input.pixelAreasMm2[i],
          0,
        )) /
      input.observableBonePixelCounts.reduce(
        (s, v, i) => s + v * input.pixelAreasMm2[i],
        0,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stainedPixelCounts: [10, 20],
  observableBonePixelCounts: [20, 80],
  pixelAreasMm2: [1, 2],
} satisfies Input;
export const exampleOutput = {
  perSpecimenStainedCoveragePercent: [50, 25],
  pooledPhysicalAreaStainedCoveragePercent: 27.77777777777778,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/manganese-stain-coverage",
  title: "Manganese Staining Coverage Percent",
  description:
    "Aggregate caller identified manganese stain coverage from bone masks with physical pixel-area correction; staining chemistry, mineral identity and depositional history remain external.",
  inputs: inputFields,
  outputs: [
    {
      id: "perSpecimenStainedCoveragePercent",
      label: "Per specimen stained coverage percent",
      kind: "numberList",
    },
    {
      id: "pooledPhysicalAreaStainedCoveragePercent",
      label: "Pooled physical area stained coverage percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      stainedPixelCounts: value.stainedPixelCounts as readonly number[],
      observableBonePixelCounts:
        value.observableBonePixelCounts as readonly number[],
      pixelAreasMm2: value.pixelAreasMm2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
