import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  maximum,
  minimum,
} from "../shared.js";
export type Input = Readonly<{
  readonly ceramicWallThicknessesMm: readonly number[];
  readonly representedProfileLengthsMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly profileWeightedWallThicknessMm: number;
  readonly minimumMeasuredWallThicknessMm: number;
  readonly maximumMeasuredWallThicknessMm: number;
}>;
const inputFields = [
  {
    id: "ceramicWallThicknessesMm",
    label: "Ceramic wall thicknesses mm",
    kind: "numberList",
  },
  {
    id: "representedProfileLengthsMm",
    label: "Represented profile lengths mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.ceramicWallThicknessesMm.forEach((v) =>
    positive(v, "ceramicWallThicknessesMm"),
  );
  input.representedProfileLengthsMm.forEach((v) =>
    positive(v, "representedProfileLengthsMm"),
  );
  aligned(
    input.ceramicWallThicknessesMm,
    input.representedProfileLengthsMm,
    "ceramicWallThicknessesMm",
  );
  const total = input.representedProfileLengthsMm.reduce((a, b) => a + b, 0);
  return {
    profileWeightedWallThicknessMm: input.ceramicWallThicknessesMm.reduce(
      (s, v, i) => s + (v * input.representedProfileLengthsMm[i]) / total,
      0,
    ),
    minimumMeasuredWallThicknessMm: minimum(input.ceramicWallThicknessesMm),
    maximumMeasuredWallThicknessMm: maximum(input.ceramicWallThicknessesMm),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  ceramicWallThicknessesMm: [2, 4, 6],
  representedProfileLengthsMm: [1, 2, 1],
} satisfies Input;
export const exampleOutput = {
  profileWeightedWallThicknessMm: 4,
  minimumMeasuredWallThicknessMm: 2,
  maximumMeasuredWallThicknessMm: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/wall-thickness-mean-ceramic",
  title: "Mean Ceramic Wall Thickness",
  description:
    "Summarize ceramic wall measurements weighted by represented profile length, retaining sampled minimum/maximum rather than assuming uniform thickness.",
  inputs: inputFields,
  outputs: [
    {
      id: "profileWeightedWallThicknessMm",
      label: "Profile weighted wall thickness mm",
      kind: "number",
    },
    {
      id: "minimumMeasuredWallThicknessMm",
      label: "Minimum measured wall thickness mm",
      kind: "number",
    },
    {
      id: "maximumMeasuredWallThicknessMm",
      label: "Maximum measured wall thickness mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      ceramicWallThicknessesMm:
        value.ceramicWallThicknessesMm as readonly number[],
      representedProfileLengthsMm:
        value.representedProfileLengthsMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
