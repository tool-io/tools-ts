import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  clippedAreaIntegral,
} from "../shared.js";
export type Input = Readonly<{
  readonly depthsM: readonly number[];
  readonly areasM2: readonly number[];
  readonly epilimnionBottomM: number;
  readonly hypolimnionTopM: number;
}>;
export type Output = Readonly<{
  readonly epilimnionVolumeM3: number;
  readonly metalimnionVolumeM3: number;
  readonly hypolimnionVolumeM3: number;
  readonly totalModeledVolumeM3: number;
}>;
const inputFields = [
  { id: "depthsM", label: "Depths m", kind: "numberList" },
  { id: "areasM2", label: "Areas m2", kind: "numberList" },
  { id: "epilimnionBottomM", label: "Epilimnion bottom m", kind: "number" },
  { id: "hypolimnionTopM", label: "Hypolimnion top m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.epilimnionBottomM, "epilimnionBottomM");
  nonnegative(input.hypolimnionTopM, "hypolimnionTopM");
  if (input.depthsM[0] !== 0 || input.epilimnionBottomM > input.hypolimnionTopM)
    simpleError(
      "epilimnionBottomM",
      "Surface depth zero and ordered layer boundaries required.",
    );
  const end = input.depthsM.at(-1)!,
    epilimnionVolumeM3 = clippedAreaIntegral(
      input.depthsM,
      input.areasM2,
      0,
      input.epilimnionBottomM,
    ),
    metalimnionVolumeM3 = clippedAreaIntegral(
      input.depthsM,
      input.areasM2,
      input.epilimnionBottomM,
      input.hypolimnionTopM,
    ),
    hypolimnionVolumeM3 = clippedAreaIntegral(
      input.depthsM,
      input.areasM2,
      input.hypolimnionTopM,
      end,
    );
  return {
    epilimnionVolumeM3,
    metalimnionVolumeM3,
    hypolimnionVolumeM3,
    totalModeledVolumeM3:
      epilimnionVolumeM3 + metalimnionVolumeM3 + hypolimnionVolumeM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depthsM: [0, 10, 20],
  areasM2: [100, 50, 0],
  epilimnionBottomM: 5,
  hypolimnionTopM: 15,
} satisfies Input;
export const exampleOutput = {
  epilimnionVolumeM3: 437.5,
  metalimnionVolumeM3: 500,
  hypolimnionVolumeM3: 62.5,
  totalModeledVolumeM3: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/epilimnion-hypolimnion-volume-split",
  title: "Epilimnion Hypolimnion Volume Split",
  description:
    "Integrate a supplied piecewise-linear area-depth curve across thermal-layer boundaries including split contour intervals; geometry is supplied, not reconstructed from map coordinates.",
  inputs: inputFields,
  outputs: [
    { id: "epilimnionVolumeM3", label: "Epilimnion volume m3", kind: "number" },
    {
      id: "metalimnionVolumeM3",
      label: "Metalimnion volume m3",
      kind: "number",
    },
    {
      id: "hypolimnionVolumeM3",
      label: "Hypolimnion volume m3",
      kind: "number",
    },
    {
      id: "totalModeledVolumeM3",
      label: "Total modeled volume m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      depthsM: value.depthsM as readonly number[],
      areasM2: value.areasM2 as readonly number[],
      epilimnionBottomM: value.epilimnionBottomM as number,
      hypolimnionTopM: value.hypolimnionTopM as number,
    }),
});
export const run = tool.execute;
export default tool;
