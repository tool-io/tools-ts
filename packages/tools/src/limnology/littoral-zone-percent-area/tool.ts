import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly patchAreasM2: readonly number[];
  readonly patchRepresentativeDepthsM: readonly number[];
  readonly maximumColonizationDepthM: number;
}>;
export type Output = Readonly<{
  readonly littoralAreaM2: number;
  readonly totalMappedAreaM2: number;
  readonly littoralAreaPercent: number;
}>;
const inputFields = [
  { id: "patchAreasM2", label: "Patch areas m2", kind: "numberList" },
  {
    id: "patchRepresentativeDepthsM",
    label: "Patch representative depths m",
    kind: "numberList",
  },
  {
    id: "maximumColonizationDepthM",
    label: "Maximum colonization depth m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.patchAreasM2.forEach((v) => positive(v, "patchAreasM2"));
  input.patchRepresentativeDepthsM.forEach((v) =>
    nonnegative(v, "patchRepresentativeDepthsM"),
  );
  nonnegative(input.maximumColonizationDepthM, "maximumColonizationDepthM");
  aligned(input.patchAreasM2, input.patchRepresentativeDepthsM, "patchAreasM2");
  const totalMappedAreaM2 = input.patchAreasM2.reduce((a, b) => a + b, 0),
    littoralAreaM2 = input.patchAreasM2.reduce(
      (s, v, i) =>
        s +
        (input.patchRepresentativeDepthsM[i] <= input.maximumColonizationDepthM
          ? v
          : 0),
      0,
    );
  return {
    littoralAreaM2,
    totalMappedAreaM2,
    littoralAreaPercent: (100 * littoralAreaM2) / totalMappedAreaM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  patchAreasM2: [100, 200, 100],
  patchRepresentativeDepthsM: [1, 3, 5],
  maximumColonizationDepthM: 2,
} satisfies Input;
export const exampleOutput = {
  littoralAreaM2: 100,
  totalMappedAreaM2: 400,
  littoralAreaPercent: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/littoral-zone-percent-area",
  title: "Littoral Zone Percent Area",
  description:
    "Classify measured lake-bottom patches by a caller colonization depth and sum area; assumes each representative depth describes its patch and does not infer vegetation presence or map geometry.",
  inputs: inputFields,
  outputs: [
    { id: "littoralAreaM2", label: "Littoral area m2", kind: "number" },
    { id: "totalMappedAreaM2", label: "Total mapped area m2", kind: "number" },
    {
      id: "littoralAreaPercent",
      label: "Littoral area percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      patchAreasM2: value.patchAreasM2 as readonly number[],
      patchRepresentativeDepthsM:
        value.patchRepresentativeDepthsM as readonly number[],
      maximumColonizationDepthM: value.maximumColonizationDepthM as number,
    }),
});
export const run = tool.execute;
export default tool;
