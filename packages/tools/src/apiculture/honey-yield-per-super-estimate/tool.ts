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
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly fullFrameMassesKg: readonly number[];
  readonly postExtractionMassesKg: readonly number[];
  readonly frameTaresKg: readonly number[];
}>;
export type Output = Readonly<{
  readonly recoveredHoneyKg: number;
  readonly residualHoneyKg: number;
  readonly massRecoveryFraction: number;
}>;
const inputFields = [
  {
    id: "fullFrameMassesKg",
    label: "Full frame masses kg",
    kind: "numberList",
  },
  {
    id: "postExtractionMassesKg",
    label: "Post extraction masses kg",
    kind: "numberList",
  },
  { id: "frameTaresKg", label: "Frame tares kg", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.fullFrameMassesKg.forEach((v) => nonnegative(v, "fullFrameMassesKg"));
  input.postExtractionMassesKg.forEach((v) =>
    nonnegative(v, "postExtractionMassesKg"),
  );
  input.frameTaresKg.forEach((v) => nonnegative(v, "frameTaresKg"));
  aligned(
    input.fullFrameMassesKg,
    input.postExtractionMassesKg,
    "fullFrameMassesKg",
  );
  aligned(input.fullFrameMassesKg, input.frameTaresKg, "fullFrameMassesKg");
  let recoveredHoneyKg = 0,
    residualHoneyKg = 0;
  input.fullFrameMassesKg.forEach((v, i) => {
    const p = input.postExtractionMassesKg[i],
      t = input.frameTaresKg[i];
    if (p < t || p > v)
      simpleError(
        "postExtractionMassesKg",
        "Tare ≤ post-extraction ≤ full mass required.",
      );
    recoveredHoneyKg += v - p;
    residualHoneyKg += p - t;
  });
  const total = positive(
    recoveredHoneyKg + residualHoneyKg,
    "fullFrameMassesKg",
  );
  return {
    recoveredHoneyKg,
    residualHoneyKg,
    massRecoveryFraction: recoveredHoneyKg / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fullFrameMassesKg: [2, 3],
  postExtractionMassesKg: [1, 1.5],
  frameTaresKg: [0.5, 0.5],
} satisfies Input;
export const exampleOutput = {
  recoveredHoneyKg: 2.5,
  residualHoneyKg: 1.5,
  massRecoveryFraction: 0.625,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/honey-yield-per-super-estimate",
  title: "Honey Yield Per Super Estimate",
  description:
    "Measure per-super honey recovery and residual from matched full/post-extraction frame weights and tares; frame wax/wood tare must remain constant.",
  inputs: inputFields,
  outputs: [
    { id: "recoveredHoneyKg", label: "Recovered honey kg", kind: "number" },
    { id: "residualHoneyKg", label: "Residual honey kg", kind: "number" },
    {
      id: "massRecoveryFraction",
      label: "Mass recovery fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      fullFrameMassesKg: value.fullFrameMassesKg as readonly number[],
      postExtractionMassesKg: value.postExtractionMassesKg as readonly number[],
      frameTaresKg: value.frameTaresKg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
