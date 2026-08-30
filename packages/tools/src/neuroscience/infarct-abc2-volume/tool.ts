import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly longestDiameterCm: number;
  readonly perpendicularDiameterCm: number;
  readonly sliceThicknessCm: number;
  readonly sliceWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly weightedExtentCm: number;
  readonly approximateVolumeMl: number;
}>;
const inputFields = [
  { id: "longestDiameterCm", label: "Longest diameter cm", kind: "number" },
  {
    id: "perpendicularDiameterCm",
    label: "Perpendicular diameter cm",
    kind: "number",
  },
  { id: "sliceThicknessCm", label: "Slice thickness cm", kind: "number" },
  { id: "sliceWeights", label: "Slice weights", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.longestDiameterCm, "longestDiameterCm");
  positive(input.perpendicularDiameterCm, "perpendicularDiameterCm");
  positive(input.sliceThicknessCm, "sliceThicknessCm");
  if (input.perpendicularDiameterCm > input.longestDiameterCm)
    simpleError(
      "perpendicularDiameterCm",
      "Perpendicular diameter cannot exceed the longest diameter.",
    );
  if (!input.sliceWeights.length)
    simpleError("sliceWeights", "Nonempty slice weights required.");
  input.sliceWeights.forEach((v) => fraction(v, "sliceWeights"));
  const weightedExtentCm =
    input.sliceThicknessCm * input.sliceWeights.reduce((a, b) => a + b, 0);
  return {
    weightedExtentCm,
    approximateVolumeMl:
      (input.longestDiameterCm *
        input.perpendicularDiameterCm *
        weightedExtentCm) /
      2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  longestDiameterCm: 4,
  perpendicularDiameterCm: 3,
  sliceThicknessCm: 0.5,
  sliceWeights: [1, 1, 0.5],
} satisfies Input;
export const exampleOutput = {
  weightedExtentCm: 1.25,
  approximateVolumeMl: 7.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/infarct-abc2-volume",
  title: "Infarct Volume ABC/2",
  description:
    "Estimate ABC/2 lesion volume using caller-measured perpendicular diameters and fractional slice weights; irregular infarcts can violate the ellipsoidal approximation.",
  inputs: inputFields,
  outputs: [
    { id: "weightedExtentCm", label: "Weighted extent cm", kind: "number" },
    {
      id: "approximateVolumeMl",
      label: "Approximate volume ml",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      longestDiameterCm: value.longestDiameterCm as number,
      perpendicularDiameterCm: value.perpendicularDiameterCm as number,
      sliceThicknessCm: value.sliceThicknessCm as number,
      sliceWeights: value.sliceWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
