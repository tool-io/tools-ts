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
  readonly preYearNir: readonly number[];
  readonly preYearRed: readonly number[];
  readonly postYearNir: readonly number[];
  readonly postYearRed: readonly number[];
  readonly callerMinimumNdviDrop: number;
}>;
export type Output = Readonly<{
  readonly preYearNdvi: readonly number[];
  readonly postYearNdvi: readonly number[];
  readonly signedNdviDrops: readonly number[];
  readonly aboveCallerDropFlags: readonly number[];
}>;
const inputFields = [
  { id: "preYearNir", label: "Pre year nir", kind: "numberList" },
  { id: "preYearRed", label: "Pre year red", kind: "numberList" },
  { id: "postYearNir", label: "Post year nir", kind: "numberList" },
  { id: "postYearRed", label: "Post year red", kind: "numberList" },
  {
    id: "callerMinimumNdviDrop",
    label: "Caller minimum ndvi drop",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.preYearNir.forEach((v) => nonnegative(v, "preYearNir"));
  input.preYearRed.forEach((v) => nonnegative(v, "preYearRed"));
  input.postYearNir.forEach((v) => nonnegative(v, "postYearNir"));
  input.postYearRed.forEach((v) => nonnegative(v, "postYearRed"));
  nonnegative(input.callerMinimumNdviDrop, "callerMinimumNdviDrop");
  aligned(input.preYearNir, input.preYearRed, "preYearNir");
  aligned(input.preYearNir, input.postYearNir, "preYearNir");
  aligned(input.preYearNir, input.postYearRed, "preYearNir");
  const preYearNdvi = input.preYearNir.map(
      (n, i) =>
        (n - input.preYearRed[i]) /
        positive(n + input.preYearRed[i], "preBands"),
    ),
    postYearNdvi = input.postYearNir.map(
      (n, i) =>
        (n - input.postYearRed[i]) /
        positive(n + input.postYearRed[i], "postBands"),
    ),
    signedNdviDrops = preYearNdvi.map((v, i) => v - postYearNdvi[i]);
  return {
    preYearNdvi,
    postYearNdvi,
    signedNdviDrops,
    aboveCallerDropFlags: signedNdviDrops.map((v) =>
      v > input.callerMinimumNdviDrop ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  preYearNir: [0.8, 0.6],
  preYearRed: [0.2, 0.4],
  postYearNir: [0.6, 0.8],
  postYearRed: [0.4, 0.2],
  callerMinimumNdviDrop: 0.2,
} satisfies Input;
export const exampleOutput = {
  preYearNdvi: [0.6, 0.2],
  postYearNdvi: [0.2, 0.6],
  signedNdviDrops: [0.4, -0.4],
  aboveCallerDropFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/ndvi-change-annual-defoliation-watch",
  title: "Annual NDVI Change Defoliation Watch",
  description:
    "Track paired annual NIR/red NDVI drops against caller screening threshold, retaining greening; unlike SWIR-based dNBR, input bands differ and neither index diagnoses defoliation agents.",
  inputs: inputFields,
  outputs: [
    { id: "preYearNdvi", label: "Pre year ndvi", kind: "numberList" },
    { id: "postYearNdvi", label: "Post year ndvi", kind: "numberList" },
    { id: "signedNdviDrops", label: "Signed ndvi drops", kind: "numberList" },
    {
      id: "aboveCallerDropFlags",
      label: "Above caller drop flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      preYearNir: value.preYearNir as readonly number[],
      preYearRed: value.preYearRed as readonly number[],
      postYearNir: value.postYearNir as readonly number[],
      postYearRed: value.postYearRed as readonly number[],
      callerMinimumNdviDrop: value.callerMinimumNdviDrop as number,
    }),
});
export const run = tool.execute;
export default tool;
