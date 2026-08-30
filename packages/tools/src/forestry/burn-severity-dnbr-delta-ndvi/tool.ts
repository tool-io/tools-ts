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
  readonly preFireNir: readonly number[];
  readonly preFireSwir: readonly number[];
  readonly postFireNir: readonly number[];
  readonly postFireSwir: readonly number[];
}>;
export type Output = Readonly<{
  readonly preFireNbr: readonly number[];
  readonly postFireNbr: readonly number[];
  readonly deltaNbr: readonly number[];
}>;
const inputFields = [
  { id: "preFireNir", label: "Pre fire nir", kind: "numberList" },
  { id: "preFireSwir", label: "Pre fire swir", kind: "numberList" },
  { id: "postFireNir", label: "Post fire nir", kind: "numberList" },
  { id: "postFireSwir", label: "Post fire swir", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.preFireNir.forEach((v) => nonnegative(v, "preFireNir"));
  input.preFireSwir.forEach((v) => nonnegative(v, "preFireSwir"));
  input.postFireNir.forEach((v) => nonnegative(v, "postFireNir"));
  input.postFireSwir.forEach((v) => nonnegative(v, "postFireSwir"));
  aligned(input.preFireNir, input.preFireSwir, "preFireNir");
  aligned(input.preFireNir, input.postFireNir, "preFireNir");
  aligned(input.preFireNir, input.postFireSwir, "preFireNir");
  const preFireNbr = input.preFireNir.map(
      (n, i) =>
        (n - input.preFireSwir[i]) /
        positive(n + input.preFireSwir[i], "preFireBands"),
    ),
    postFireNbr = input.postFireNir.map(
      (n, i) =>
        (n - input.postFireSwir[i]) /
        positive(n + input.postFireSwir[i], "postFireBands"),
    );
  return {
    preFireNbr,
    postFireNbr,
    deltaNbr: preFireNbr.map((v, i) => v - postFireNbr[i]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  preFireNir: [0.8],
  preFireSwir: [0.2],
  postFireNir: [0.4],
  postFireSwir: [0.6],
} satisfies Input;
export const exampleOutput = {
  preFireNbr: [0.6],
  postFireNbr: [-0.2],
  deltaNbr: [0.8],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/burn-severity-dnbr-delta-ndvi",
  title: "dNBR Burn Severity Delta NDVI",
  description:
    "Compute paired NIR/SWIR normalized burn ratio and signed pre-minus-post dNBR; title’s NDVI wording is not used because NBR requires SWIR, and severity class/local ecological outcome is not inferred.",
  inputs: inputFields,
  outputs: [
    { id: "preFireNbr", label: "Pre fire nbr", kind: "numberList" },
    { id: "postFireNbr", label: "Post fire nbr", kind: "numberList" },
    { id: "deltaNbr", label: "Delta nbr", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      preFireNir: value.preFireNir as readonly number[],
      preFireSwir: value.preFireSwir as readonly number[],
      postFireNir: value.postFireNir as readonly number[],
      postFireSwir: value.postFireSwir as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
